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
  const hintCache = useMemo(() => new Map(), []);
  const forceUpdate = useForceUpdate();
  const [selectedHint, setSelectedHint] = useState(null);

  useEffect(() => {
    if (hintCache.has(searchKeyword)) return;
    nextApi.fetch(`search/autocomplete?prefix=${searchKeyword}`).then((res) => {
      const categories = [ 'blocks', 'assets', 'addresses', 'nftClasses', 'nftInstances'];
      const linkedList = {head:null, current:null, tail:null};
      categories.forEach(category => {
        res.result[category].forEach(hint => {
          const node = {type:category, ...hint};
          if (!linkedList.head) {
            linkedList.head = node;
            linkedList.current = node;
            linkedList.tail = node;
          } else {
            node.previous = linkedList.current;
            node.next = linkedList.head;//loop linked list
            linkedList.current.next = node;
            linkedList.current = node;
            linkedList.tail = node;
            linkedList.head.previous = node;
          }
        });
      });
      setSelectedHint(linkedList.head);
      hintCache.set(searchKeyword, res?.result);
      forceUpdate();
    });
  }, [searchKeyword, hintCache, forceUpdate]);

  useEffect(() => {
    setSearchKeyword("");
  }, [router]);

  const onInput = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
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
      if (!toPage(selectedHint)) {
        onSearch();
      }
      return;
    }
    if (e.code === "ArrowUp") {
      e.preventDefault();
      selectedHint?.previous && setSelectedHint(selectedHint?.previous);
      return;
    }
    if (e.code === "ArrowDown") {
      e.preventDefault();
      selectedHint?.next && setSelectedHint(selectedHint?.next);
    }
  };

  const toPage = (selectedHint) => {
    const {type} = selectedHint;
    if (type === "blocks") {
      router.push(`/block/${selectedHint?.header?.number}`);
      return true;
    }
    if (type === "assets") {
      router.push(`/asset/${selectedHint.assetId}_${selectedHint.createdAt.blockHeight}`);
      return true;
    }
    if (type === "nftClasses") {
      router.push(`/nft/classes/${selectedHint?.classId}`);
      return true;
    }
    if (type === "nftInstances") {
      router.push(`/nft/classes/${selectedHint?.classId}/instances/${selectedHint.nftInstances[index].instanceId}`);
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
          hints={hintCache.get(searchKeyword)}
          focus={focus}
          selectedHint={selectedHint}
          toPage={toPage}
        />
      </SearchWrapper>
    </ExploreWrapper>
  );
}
