import styled, { css } from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { addToast } from "../../store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import nextApi from "services/nextApi";
import { useTheme, useForceUpdate } from "utils/hooks";
import SearchHints from "./searchHints";

const ExploreWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  > :not(:first-child) {
    margin-left: 16px;
  }

  @media screen and (max-width: 900px) {
    flex-direction: column;
    width: 100%;
    > * {
      width: 100% !important;
    }

    > :not(:first-child) {
      margin: 16px 0 0;
    }
  }
`;

const ExploreInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  font-size: 15px;
  line-height: 18px;
  outline: none;

  ::placeholder {
    color: rgba(17, 17, 17, 0.35);
  }

  :active,
  :focus {
    border: 1px solid #bbbbbb;
  }
`;

const ExploreButton = styled.div`
  background: ${(p) => p.themecolor};
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
  ${(p) =>
    p.node === "kusama" &&
    css`
      background: #000000;
    `}
`;

const SearchWrapper = styled.div`
  position: relative;
  align-self: flex-start;
  width: 480px;
`;

export default function SearchL({ node }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [focus, setFocus] = useState(false);
  const hintMap = useMemo(() => new Map(), []);
  const theme = useTheme();
  const forceUpdate = useForceUpdate();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (hintMap.has(searchKeyword)) return;
    nextApi.fetch(`search/autocomplete?prefix=${searchKeyword}`).then((res) => {
      hintMap.set(searchKeyword, res?.result);
      forceUpdate();
    });
  }, [searchKeyword, hintMap, forceUpdate]);

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

  return (
    <ExploreWrapper>
      <SearchWrapper>
        <ExploreInput
          onKeyDown={onKeyDown}
          value={searchKeyword}
          onChange={onInput}
          placeholder="Block / Address / Extrinsic / Asset /..."
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 200)}
        />
        <SearchHints
          hints={hintMap.get(searchKeyword)}
          focus={focus}
          selected={selected}
          toPage={toPage}
        />
      </SearchWrapper>
      <ExploreButton
        node={node}
        onClick={onSearch}
        themecolor={theme.buttonColor}
      >
        Explore
      </ExploreButton>
    </ExploreWrapper>
  );
}
