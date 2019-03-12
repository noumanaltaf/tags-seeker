import * as React from 'react';
import { List, ArrowKeyStepper } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import * as R from 'ramda';
import classnames from 'classnames';
import { Icon } from 'antd';

export type Props = {
  data: Array<any>;
  onItemClick: Function;
  height?: any;
  width?: any;
  rowHeight?: any;
};

type State = {
  listItems: Array<any>;
  mode: any;
  scrollToIndex: number;
};

type Row = {
  key: string;
  index: number;
  style: any;
  scrollToRow: number;
};

class InfiniteList extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      listItems: props.data,
      mode: 'cells',
      scrollToIndex: 0
    };

    this._rowRenderer = this._rowRenderer.bind(this);
    this._onItemKeyDown = this._onItemKeyDown.bind(this);
  }

  componentDidMount() {
    const scrollableList = document.querySelector(
      '.tags-seeker-dropdown .ReactVirtualized__List'
    ) as HTMLDivElement;
    scrollableList.addEventListener('keydown', this._onItemKeyDown);
  }
  componentWillUnmount() {
    const scrollableList = document.querySelector(
      '.tags-seeker-dropdown .ReactVirtualized__List'
    ) as HTMLDivElement;
    scrollableList.removeEventListener('keydown', this._onItemKeyDown);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!R.equals(this.props.data, nextProps.data)) {
      this.setState({
        listItems: nextProps.data,
        scrollToIndex: 0
      });
    }
  }
  _onItemKeyDown = (e: any) => {
    const { onItemClick } = this.props;
    const { scrollToIndex, listItems } = this.state;
    if (R.equals(e.keyCode, 13) && !R.isNil(scrollToIndex)) {
      onItemClick(listItems[scrollToIndex]);
    }
  };

  _rowRenderer = ({ key, index, style, scrollToRow }: Row) => {
    const { listItems } = this.state;
    const { onItemClick } = this.props;
    const item = listItems[index];
    return (
      <div
        className={classnames({ 'list-item': true, focused: index === scrollToRow })}
        title={item.title}
        key={key}
        style={style}
        onKeyDown={(e: any) => this._onItemKeyDown(e)}
        onClick={() => onItemClick(item)}>
        {item.icon && <Icon type="user" />}
        {item.title && <span>{item.title}</span>}
      </div>
    );
  };

  _selectCell = ({ scrollToRow }: any) => {
    this.setState({ scrollToIndex: scrollToRow });
  };

  render() {
    const { listItems, mode, scrollToIndex } = this.state;
    const { rowHeight = 30, height = 180, width = 200 } = this.props;
    const _height = rowHeight * listItems.length > height ? height : rowHeight * listItems.length;

    return (
      <ArrowKeyStepper
        mode={mode}
        rowCount={listItems.length}
        columnCount={1}
        onScrollToChange={this._selectCell}
        scrollToRow={scrollToIndex}>
        {({ scrollToRow }: any) => {
          return (
            <List
              width={width}
              height={_height}
              columnCount={1}
              className="slim-scroll"
              rowCount={listItems.length}
              rowHeight={rowHeight}
              scrollToIndex={scrollToRow}
              rowRenderer={(o: any) => this._rowRenderer({ ...o, scrollToRow })}
              list={listItems}
            />
          );
        }}
      </ArrowKeyStepper>
    );
  }
}

export default InfiniteList;
