import styled from "styled-components";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useHomePage, useForceUpdate } from "utils/hooks";
import { addToast } from "../../store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import nextApi from "services/nextApi";
import SearchHints from "./searchHints";

const ExploreWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  > :not(:first-child) {
    margin-left: 16px;
  }

  @media screen and (max-width: 900px) {
    display: none;
  }
`;

const Input = styled.input`
  padding-left: 44px;
  width: 280px;
  font-size: 15px;
  line-height: 36px;
  border: none;
  color: #111111;
  background: url("/imgs/icons/search-idle.svg") no-repeat scroll 7px 7px;

  ::placeholder {
    color: rgba(17, 17, 17, 0.35);
  }

  :focus,
  :focus-visible {
    outline: none;
    background: url("/imgs/icons/search-focus.svg") no-repeat scroll 7px 7px;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  align-self: flex-start;
`;

export default function SearchS() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isHomePage = useHomePage();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [focus, setFocus] = useState(false);
  const hintMap = useMemo(() => new Map(), []);
  const forceUpdate = useForceUpdate();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (hintMap.has(searchKeyword)) return;
    nextApi.fetch(`search/autocomplete?prefix=${searchKeyword}`).then((res) => {
      hintMap.set(searchKeyword, res?.result);
      forceUpdate();
    });
  }, [searchKeyword, hintMap, forceUpdate]);

  useEffect(() => {
    setSearchKeyword("");
  }, [router]);

  const onInput = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    setSelected(0);
  };

  const onSearch = () => {
    nextApi.fetch(`search?q=${searchKeyword}`).then((res) => {
      const { asset, extrinsic, block, address } = res.result || {};
      if (asset) {
        const { blockHeight } = asset.createdAt;
        return router.push(`/asset/${asset.assetId}_${blockHeight}`);
      }
      if (extrinsic) {
        const { blockHeight, index } = extrinsic.indexer;
        return router.push(`/extrinsic/${blockHeight}-${index}`);
      }
      if (block) {
        const height = block.header?.number;
        return height && router.push(`/block/${height}`);
      }
      if (address) {
        return router.push(`/account/${address.address}`);
      }
      dispatch(addToast({ type: "error", message: "No result found" }));
    });
  };

  const onKeyDown = (e) => {
    if (!focus) {
      return;
    }
    if (e.code === "Enter") {
      if (!toPage(selected)) {
        onSearch();
      }
      return;
    }
    if (e.code === "ArrowUp") {
      e.preventDefault();
      if (selected > 0) {
        setSelected(selected - 1);
      }
      return;
    }
    if (e.code === "ArrowDown") {
      e.preventDefault();
      const max =
        (hintMap.get(searchKeyword)?.blocks?.length ?? 0) +
        (hintMap.get(searchKeyword)?.assets?.length ?? 0);
      if (selected < max - 1) {
        setSelected(selected + 1);
      }
      return;
    }
  };

  const toPage = (index) => {
    const currentHint = hintMap.get(searchKeyword);
    const blocksLength = currentHint?.blocks?.length ?? 0;
    const assetsLength = currentHint?.assets?.length ?? 0;
    const maxLength = blocksLength + assetsLength;
    if (index < 0 || index >= maxLength) return;
    if (index + 1 <= blocksLength) {
      router.push(`/block/${currentHint.blocks[index].header?.number}`);
      return true;
    }
    if (index + 1 > blocksLength && index + 1 <= maxLength) {
      router.push(
        `/asset/${currentHint.assets[index - blocksLength].assetId}_${
          currentHint.assets[index - blocksLength].createdAt.blockHeight
        }`
      );
      return true;
    }
    return false;
  };

  if (isHomePage) return null;

  return (
    <ExploreWrapper>
      <SearchWrapper>
        <Input
          value={searchKeyword}
          onChange={onInput}
          placeholder="Address / Transaction / Asset..."
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 100)}
          onKeyDown={onKeyDown}
        />
        <SearchHints
          hints={hintMap.get(searchKeyword)}
          focus={focus}
          selected={selected}
          toPage={toPage}
        />
      </SearchWrapper>
    </ExploreWrapper>
  );
}
