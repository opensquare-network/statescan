import styled, { css } from "styled-components";
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { addToast } from "../../store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import nextApi from "services/nextApi";
import debounce from "lodash/debounce";
import { useTheme } from "utils/hooks";
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
  const [hints, setHints] = useState([]);
  const [focus, setFocus] = useState(false);
  const [selected, select] = useState(0);
  const theme = useTheme();

  const delayedQuery = useCallback(() => {
    return debounce((value) => {
      nextApi.fetch(`search/autocomplete?prefix=${value}`).then((res) => {
        console.log({ res });
        setHints(res?.result);
      });
    }, 500);
  }, []);

  const onInput = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    delayedQuery()(value);
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
    return;
    if (!focus) {
      return;
    }

    if (e.code === "Enter") {
      if (selected > assets.length - 1) {
        return onSearch();
      }
      const hint = assets[selected];
      return router.push(
        `/asset/${hint.assetId}_${hint.createdAt?.blockHeight}`
      );
    }

    if (e.code === "ArrowDown" && selected < assets.length - 1) {
      select(selected + 1);
    }

    if (e.code === "ArrowUp" && selected > 0) {
      select(selected - 1);
    }
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
          onBlur={() => setTimeout(() => setFocus(false), 100)}
        />
        <SearchHints hints={hints} focus={focus} />
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
