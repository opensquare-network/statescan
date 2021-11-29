import styled, { css } from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { addToast } from "../../store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import nextApi from "services/nextApi";
import { useTheme, useForceUpdate } from "utils/hooks";
import SearchHints from "./searchHints";
import ClearIcon from "../../public/imgs/icons/clear.svg";

const Clear = styled(ClearIcon)`
  position: absolute;
  right: 12px;
  top: 12px;
  cursor: pointer;
`

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

export default function SearchL({node}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [focus, setFocus] = useState(false);
  const hintCache = useMemo(() => new Map(), []);
  const theme = useTheme();
  const forceUpdate = useForceUpdate();
  const [selectedHint, setSelectedHint] = useState(null);

  useEffect(() => {
    if (hintCache.has(searchKeyword)) return;
    nextApi.fetch(`search/autocomplete?prefix=${searchKeyword}`).then((res) => {
      const categories = ['blocks', 'assets', 'addresses', 'nftClasses', 'nftInstances'];
      const linkedList = {head: null, current: null, tail: null};
      categories.forEach(category => {
        res.result[category].forEach(hint => {
          const node = {type: category, ...hint};
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

  const onInput = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
  };

  const onSearch = () => {
    nextApi.fetch(`search?q=${searchKeyword}`).then((res) => {
      const {asset, extrinsic, block, address} = res.result || {};
      if (asset) {
        const {blockHeight} = asset.createdAt;
        return router.push(`/asset/${asset.assetId}_${blockHeight}`);
      }
      if (extrinsic) {
        const {blockHeight, index} = extrinsic.indexer;
        return router.push(`/extrinsic/${blockHeight}-${index}`);
      }
      if (block) {
        const height = block.header?.number;
        return height && router.push(`/block/${height}`);
      }
      if (address) {
        return router.push(`/account/${address.address}`);
      }
      dispatch(addToast({type: "error", message: "No result found"}));
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
    if (!selectedHint) return;
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
      router.push(`/nft/class/${selectedHint?.classId}`);
      return true;
    }
    if (type === "nftInstances") {
      router.push(`/nft/class/${selectedHint?.classId}/instance/${selectedHint.instanceId}`);
      return true;
    }
    return false;
  };

  return (
    <ExploreWrapper>
      <SearchWrapper>
        {searchKeyword && <Clear onClick={() => {
          setSearchKeyword('')
        }}/>}
        <ExploreInput
          onKeyDown={onKeyDown}
          value={searchKeyword}
          onChange={onInput}
          placeholder="Block / Address / Extrinsic / Asset / NFT /..."
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 200)}
        />
        <SearchHints
          hints={hintCache.get(searchKeyword)}
          focus={focus}
          selectedHint={selectedHint}
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
