import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useHomePage } from "utils/hooks";
import { addToast } from "../../store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import InLink from "components/inLink";
import nextApi from "services/nextApi";
import debounce from "lodash/debounce";

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

const ExploreHintsWrapper = styled.div`
  z-index: 9999999;
  background-color: #ffffff;
  margin-left: 0 !important;
  padding-top: 8px;
  padding-bottom: 8px;
  top: 53px;
  left: 0;
  width: 320px;
  max-height: 308px;
  position: absolute;
  border-radius: 8px;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border: 1px solid #ffffff;

  .selected {
    background-color: #fafafa;
  }
`;
const Input = styled.input`
  padding-left: 44px;
  width: 320px;
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

const ExploreHint = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: 0 16px 0 16px;
  cursor: pointer;
  line-height: 48px;
  background-color: #ffffff;
  font-size: 15px;

  svg,
  img {
    margin-right: 8px;
  }

  * {
    margin: 0;
  }

  :hover {
    background-color: #fafafa;
  }
`;

const Token = styled.span`
  margin-right: 8px;
  overflow: hidden;
  width: 80px;
  font-weight: 500;
  color: #111111;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-grow: 0;
`;

const TokenDesc = styled.span`
  width: 117px;
  margin-right: 8px;
  overflow: hidden;
  color: rgba(17, 17, 17, 0.35);
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-grow: 0;
`;

const Height = styled.span`
  flex-grow: 1;
  text-align: right;
  color: rgba(17, 17, 17, 0.65);
`;

export default function SearchS() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isHomePage = useHomePage();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [assets, setHintAssets] = useState([]);
  const [focus, setFocus] = useState(false);
  const [selected, select] = useState(0);
  const iconMap = new Map([["osn", "osn"]]);

  useEffect(() => {
    setSearchKeyword("");
    setHintAssets([]);
  }, [router]);

  const delayedQuery = useCallback(
    debounce((value) => {
      nextApi.fetch(`search/autocomplete?prefix=${value}`).then((res) => {
        setHintAssets(res.result?.assets || []);
      });
    }, 500),
    []
  );

  const onInput = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    delayedQuery(value);
  };

  const onKeyDown = (e) => {
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

  if (isHomePage) return null;

  return (
    <ExploreWrapper>
      <Input
        value={searchKeyword}
        onChange={onInput}
        placeholder="Address / Transaction / Asset..."
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(false), 100)}
        onKeyDown={onKeyDown}
      />
      {focus && assets?.length > 0 && (
        <ExploreHintsWrapper>
          {assets.map((hint, index) => {
            const icon = iconMap.get(hint.symbol.toLowerCase()) ?? "unknown";
            return (
              <InLink
                key={index}
                to={`/asset/${hint.assetId}_${hint.createdAt?.blockHeight}`}
              >
                <ExploreHint className={selected === index && "selected"}>
                  <img src={`/imgs/token-icons/${icon}.svg`} alt="" />
                  <Token>{hint.symbol}</Token>
                  <TokenDesc>{hint.name}</TokenDesc>
                  <Height>#{hint.assetId}</Height>
                </ExploreHint>
              </InLink>
            );
          })}
        </ExploreHintsWrapper>
      )}
    </ExploreWrapper>
  );
}
