import {
  type ChangeEvent,
  type FC,
  useState,
  KeyboardEventHandler,
  useEffect,
} from "react";
import clearIcon from "../../assets/icons/cross-small.svg";
import search from "../../assets/icons/search.svg";
import Button from "../Button/Button";
import "./search-bar.scss";
import Clickable from "../Custom/Clickable";
import { setFilterStoreKey, useFilterStore } from "../../store/useFilter";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
}
const SearchBar: FC<SearchBarProps> = ({
  value = "",
  placeholder = "Search",
  defaultValue = "",
}) => {
  const { SearchTerm } = useFilterStore();

  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [prevSearch, setPrevSearch] = useState("");

  const onClear = () => {
    setSearchValue("");

    _onSearch("");
    setFilterStoreKey("SearchTerm", "");
  };
  const _onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value ?? "");
    if (!event.target.value) _onSearch("");
  };

  const _onSearch = (value: string = "") => {
    if (value !== prevSearch) {
      setFilterStoreKey("SearchTerm", value ? value.trim() : value);
      setPrevSearch(value);
    }
  };

  const onEnter: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") _onSearch(searchValue);
  };

  useEffect(() => {
    if (defaultValue !== searchValue) setSearchValue(defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  useEffect(() => {
    setPrevSearch("");
  }, [value]);

  useEffect(() => {
    setSearchValue(SearchTerm);
  }, [SearchTerm]);

  return (
    <div className="imt-search-bar">
      {searchValue && (
        <Button isWrapper onClick={onClear}>
          <img className="clearIcon" src={clearIcon} alt="clearIcon" />
        </Button>
      )}
      <input
        id="search"
        type="search"
        placeholder={placeholder}
        value={searchValue ?? ""}
        onChange={_onInputChange}
        onKeyUp={onEnter}
        autoComplete="off"
      />
      <Clickable onClick={() => _onSearch(searchValue)}>
        <div className="searchIcon">
          <img src={search} alt="Search" />
        </div>
      </Clickable>
    </div>
  );
};

export default SearchBar;
