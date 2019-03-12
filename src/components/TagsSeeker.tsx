/**
 * @class TagsSeeker
 */

import * as React from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';
import * as R from 'ramda';
import './InfiniteList.scss';
import InfiniteList from './InfiniteList';

export type Props = {
  data: Array<any>;
  tags?: Array<any>;
  onTagsUpdate?: Function;
  className: string;
  style?: object;
  placeholder?: string;
};
type State = {
  inputFocused: boolean;
  filtersData: Array<any>;
  dropdownData: Array<any>;
  searchedDropDownData: Array<any>;
  tagsData: Array<object>;
  dropdownPos: object;
};

type Item = {
  id: number;
  title: string;
  key: string;
  icon: any;
  value: any;
};

const tagsSeekerTag = R.curry((onItemClick: Function, onRemove: Function, data: Item) => {
  const { id, title, icon, value } = data;
  return (
    <li className="filter-search-tag" key={id} onClick={() => onItemClick(id)}>
      {title && (
        <div className="name">
          {icon && <Icon type="user" />}
          <span>{title}</span>
        </div>
      )}

      {value && (
        <div className="value-container">
          {value.icon && <Icon type="user" />}
          {value.title && <span className="value">{value.title}</span>}
          <div className="remove-tag" onClick={() => onRemove(id)}>
            <Icon type="close" />
          </div>
        </div>
      )}
    </li>
  );
});

export default class TagsSeeker extends React.PureComponent<Props, State> {
  private searchInput: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);

    const data = R.defaultTo([], props.data);
    this.state = {
      inputFocused: false,
      filtersData: data,
      dropdownData: data,
      searchedDropDownData: data,
      tagsData: R.defaultTo([], props.tags),
      dropdownPos: {}
    };

    this.searchInput = React.createRef();
    this._dropDownItemHandler = this._dropDownItemHandler.bind(this);
    this._onTagRemove = this._onTagRemove.bind(this);
    this._clearOnClick = this._clearOnClick.bind(this);
    this._onInputKeyPress = this._onInputKeyPress.bind(this);
    this._onInputChange = this._onInputChange.bind(this);
  }
  componentWillMount() {
    document.addEventListener('mousedown', this._handleMouseDown);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this._handleMouseDown);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!R.equals(this.props.data, nextProps.data) || !R.equals(this.props.tags, nextProps.tags)) {
      const data = R.defaultTo([], nextProps.data);
      this.setState({
        inputFocused: false,
        filtersData: data,
        dropdownData: data,
        searchedDropDownData: data,
        tagsData: R.defaultTo([], this.props.tags)
      });
    }
  }

  componentDidUpdate() {
    this._setDropdownPosition();
  }

  _handleMouseDown = (e: any) => {
    if (e.target.closest('.input-item') || e.target.closest('.tags-seeker-dropdown')) {
      this._setInputFocus(true);
    } else {
      this._setInputFocus(false);
    }
  };

  _setInputFocus = (focus: boolean) => {
    this.setState({
      inputFocused: focus
    });
  };

  _dropDownItemHandler = (item: Item) => {
    const { dropdownData = [], tagsData = [], filtersData = [] } = this.state;
    const { onTagsUpdate = this.onTagsUpdate } = this.props;
    const inputElem = this.searchInput.current;

    // @ts-ignore
    const isNewTag = R.pipe(
      R.last,
      R.defaultTo({}),
      R.either(R.isEmpty, R.has('value'))
    )(tagsData);

    let _dropdownData = [];
    let _tagsData = [];

    if (isNewTag) {
      const newId = this.getNewTagId(tagsData);

      // @ts-ignore
      _dropdownData = R.pipe(
        R.find(R.propEq('key', item['key'])),
        R.propOr([], 'items')
      )(dropdownData);

      _tagsData = R.append(
        { id: newId, key: item.key, title: item.title, icon: item.icon },
        tagsData
      );
    } else {
      _tagsData = R.adjust(
        tagsData.length - 1,
        R.assoc('value', {
          title: item.title,
          icon: item.icon
        })
      )(tagsData);

      _dropdownData = filtersData;
      onTagsUpdate(_tagsData);
    }

    this.setState({
      dropdownData: _dropdownData,
      searchedDropDownData: _dropdownData,
      tagsData: _tagsData
    });

    if (inputElem) {
      inputElem.focus();
      inputElem.value = '';
    }
  };

  _onTagRemove = (id: number) => {
    const { tagsData } = this.state;
    const { onTagsUpdate = this.onTagsUpdate } = this.props;

    const _tagsData = R.reject(R.propEq('id', id))(tagsData);
    this.setState({
      tagsData: _tagsData
    });
    onTagsUpdate(_tagsData);
  };

  _clearOnClick = () => {
    const { filtersData } = this.state;
    this.setState({
      tagsData: [],
      dropdownData: filtersData,
      searchedDropDownData: filtersData
    });
  };

  getNewTagId = (tagsData: Array<object>) =>
    R.pipe(
      R.last,
      R.propOr(0, 'id'),
      R.inc
    )(tagsData);

  _onInputKeyPress = (e: any) => {
    const { filtersData, tagsData } = this.state;
    if (R.equals(40, e.keyCode)) {
      const elem = document.querySelector(
        '.tags-seeker-dropdown .ReactVirtualized__List'
      ) as HTMLDivElement;
      elem && elem.focus();
      e.preventDefault();
    } else if (R.equals(8, e.keyCode)) {
      this.setState({
        tagsData: R.dropLast(1, tagsData),
        dropdownData: filtersData,
        searchedDropDownData: filtersData
      });
    }
  };

  _onInputChange = (e: any) => {
    const { dropdownData } = this.state;
    const { value } = e.target;
    const searchedData = R.pipe(
      R.filter(
        R.pipe(
          R.propOr('', 'title'),
          R.test(new RegExp(value, 'i'))
        )
      ),
      (list: any) => (R.isEmpty(value) ? dropdownData : R.prepend({ title: value }, list))
    )(dropdownData);

    this.setState({
      searchedDropDownData: searchedData
    });
  };

  onTagClick = (tag: object) => {
    console.log('tag clicked', tag);
  };

  onTagsUpdate = (tagsData: Array<object>) => console.log(`Tags Updated :`, tagsData);

  _setDropdownPosition = () => {
    const inputElem = this.searchInput.current;
    const dropdownPos: any = inputElem ? inputElem.getBoundingClientRect() : {};
    const position = {
      left: dropdownPos.x,
      top: dropdownPos.y + dropdownPos.height
    };
    if (!R.equals(position, this.state.dropdownPos)) {
      this.setState({
        dropdownPos: position
      });
    }
  };

  render() {
    const { className, style, placeholder = 'Add tags to search...' } = this.props;
    const {
      inputFocused = false,
      searchedDropDownData = [],
      tagsData = [],
      dropdownPos = {}
    } = this.state;

    return (
      <div
        className={classnames('tags-seeker-container', className, {
          focus: inputFocused
        })}
        style={style}>
        <div className="search-input-container slim-scroll">
          <ul className="search-input-list">
            {tagsData.map(tagsSeekerTag(this.onTagClick, this._onTagRemove))}
            <li className="input-item">
              <input
                ref={this.searchInput}
                placeholder={placeholder}
                onChange={this._onInputChange}
                onKeyDown={this._onInputKeyPress}
              />
            </li>
          </ul>
        </div>
        {inputFocused && !R.isEmpty(searchedDropDownData) && (
          <div className="tags-seeker-dropdown" style={dropdownPos}>
            <InfiniteList
              data={searchedDropDownData}
              rowHeight={30}
              height={180}
              width={200}
              onItemClick={this._dropDownItemHandler}
            />
          </div>
        )}
        {!R.isEmpty(tagsData) && (
          <div className="clear-search" onClick={this._clearOnClick}>
            <Icon type="close" />
          </div>
        )}
      </div>
    );
  }
}
