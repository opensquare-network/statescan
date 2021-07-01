import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import { useHomePage } from "utils/hooks";

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
  margin-left: 0 !important;
  top: 53px;
  left: 0;
  width: 480px;
  max-height: 308px;
  position: absolute;
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
  width: 48px;
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

export default function SearchS() {
  const location = useLocation();
  const history = useHistory();
  const isHomePage = useHomePage();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [assets, setHintAssets] = useState([]);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    setSearchKeyword("");
    setHintAssets([]);
  }, [location]);

  const onInput = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    //todo debounce this
    axios.get(`/westmint/search/autocomplete?prefix=${value}`).then((res) => {
      setHintAssets(res.data.assets || []);
    });
  };

  const onKeyDown = (e) => {
    if (e.code === "Enter") {
      return onSearch();
    }
  };

  const onSearch = () => {
    axios.get(`/westmint/search?q=${searchKeyword}`).then((res) => {
      const { asset, extrinsic, block, address } = res.data;
      if (asset) {
        const { blockHeight } = asset.createdAt;
        return history.push(`/westmint/asset/${asset.assetId}_${blockHeight}`);
      }
      if (extrinsic) {
        const { blockHeight, index } = extrinsic.indexer;
        return history.push(`/westmint/extrinsic/${blockHeight}-${index}`);
      }
      if (block) {
        const height = res.data.block?.header?.number;
        return height && history.push(`/westmint/block/${height}`);
      }
      if (address) {
        return history.push(`/westmint/address/${address.address}`);
      }
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
      {focus && (
        <ExploreHintsWrapper>
          {assets.map((hint, index) => (
            <ExploreHint
              key={index}
              onClick={() => {
                setSearchKeyword("");
                setHintAssets([]);
                history.push(
                  `/westmint/asset/${hint.assetId}_${hint.createdAt?.blockHeight}`
                );
              }}
            >
              <img
                src={`/imgs/token-icons/${hint.symbol.toLowerCase()}.svg`}
                alt=""
              />
              <Token>{hint.symbol}</Token>
              <TokenDesc>{hint.name}</TokenDesc>
              <Height>#{hint.createdAt.blockHeight}</Height>
            </ExploreHint>
          ))}
        </ExploreHintsWrapper>
      )}
    </ExploreWrapper>
  );
}
