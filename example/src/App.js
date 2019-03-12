import React, { Component } from 'react';

import TagsSeeker from 'tags-seeker';

const filterSearchData = [
  {
    key: 'proto',
    title: 'Protocol',
    items: [{ title: 'ICMP' }, { title: 'TCP' }, { title: 'UDP' }]
  },
  {
    key: 'subscriber_ip',
    title: 'Subscriber IP',
    items: [{ title: '10.14.2.2' }]
  },
  {
    key: 'fwd_srcport',
    title: 'Subscriber Port',
    items: R.map(v => ({ title: v }))(R.range(1, 25))
  },
  {
    key: 'destination_ip',
    title: 'Destination IP',
    items: R.map(v => ({ title: `192.168.1.${v}` }))(R.range(1, 100))
  },
  {
    key: 'fwd_dstport',
    title: 'Destination Port',
    items: R.map(v => ({ title: v }))(R.range(1, 25))
  },
  {
    key: 'nat_pool_ip',
    title: 'NAT IP',
    items: R.map(v => ({ title: `192.168.2.${v}` }))(R.range(1, 25))
  },
  {
    key: 'rev_dstport',
    title: 'NAT Port',
    items: R.map(v => ({ title: v }))(R.range(1, 100))
  },
  {
    key: 'lsn_lid',
    title: 'LID',
    items: R.map(v => ({ title: v }))(R.range(1, 30))
  },
  {
    key: 'pool_name',
    title: 'Pool Name',
    items: R.map(v => ({ title: `pool_${v}` }))(R.range(1, 50))
  },
  {
    key: 'msisdn',
    title: 'MSISDN',
    items: R.map(v => ({ title: v }))(R.range(1, 60))
  },
  {
    key: 'imei',
    title: 'IMEI',
    items: R.map(v => ({ title: `a.ds.5${v}.s${v}` }))(R.range(1, 25))
  }
];

export default class App extends Component {
  render() {
    return (
      <div>
        <TagsSeeker data={filterSearchData} />
      </div>
    );
  }
}
