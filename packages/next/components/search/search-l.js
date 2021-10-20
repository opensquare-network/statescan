import styled, { css } from "styled-components";
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { addToast } from "../../store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import InLink from "components/inLink";
import nextApi from "services/nextApi";
import debounce from "lodash/debounce";
import { useTheme } from "utils/hooks";

const ExploreWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  > :not(:first-child) {
    margin-left: 16px;
  }

  @media screen and (max-width: 900px) {
    flex-direction: column;
    /* max-width: 318px; */
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
  width: 480px;
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

const ExploreHintsWrapper = styled.div`
  z-index: 9999999;
  background-color: #ffffff;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-left: 0 !important;
  top: 53px;
  left: 0;
  width: 480px;
  max-height: 308px;
  position: absolute;
  border-radius: 8px;
  border: 1px solid #f8f8f8;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);

  .selected {
    background-color: #fafafa;
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
  white-space: nowrap;
  font-weight: 500;
  color: #111111;
`;

const TokenDesc = styled.span`
  width: 299px;
  margin-right: 8px;
  overflow: hidden;
  color: rgba(17, 17, 17, 0.35);
`;

const Height = styled.span`
  color: rgba(17, 17, 17, 0.65);
`;

export default function SearchL({ node }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [assets, setHintAssets] = useState([]);
  const [focus, setFocus] = useState(false);
  const [selected, select] = useState(0);
  const iconMap = new Map([["osn", "osn"]]);
  const theme = useTheme();

  const delayedQuery = useCallback(() => {
    return debounce((value) => {
      console.log({ value });
      nextApi.fetch(`search/autocomplete?prefix=${value}`).then((res) => {
        console.log({ res });
        setHintAssets(res.result?.assets || []);
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
      <ExploreInput
        onKeyDown={onKeyDown}
        value={searchKeyword}
        onChange={onInput}
        placeholder="Block / Address / Extrinsic / Asset /..."
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(false), 100)}
      />
      <ExploreButton
        node={node}
        onClick={onSearch}
        themecolor={theme.buttonColor}
      >
        Explore
      </ExploreButton>
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
