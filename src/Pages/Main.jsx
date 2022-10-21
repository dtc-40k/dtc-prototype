import { Button, Col, Input, Layout, Row, Table, Typography } from 'antd';
import { useState } from 'react';
import '../App.css';

const { Header, Content } = Layout;

const columns = [
  {
    title: 'Id',
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Points',
    dataIndex: 'points',
    key: 'points',
    sorter: (a, b) => a.points - b.points,
  },
  {
    title: 'Wins',
    dataIndex: 'wins',
    key: 'wins',
  },
  {
    title: 'DTC Score',
    dataIndex: 'score',
    key: 'score',
    render: (score) => Math.round(score * 100) / 100,
  },
];

function Main() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState();

  const getData = () => {
    fetch(
      'https://lrs9glzzsf.execute-api.us-east-1.amazonaws.com/prod/players?eventId=4OukZIMLkY&inclEvent=true&inclMetrics=true&inclArmies=true&inclTeams=true&limit=500&metrics=[%22numWins%22,%22battlePoints%22,%22numWinsSoS%22,%22FFGBattlePointsSoS%22,%22WHArmyPoints%22,%22mfSwissPoints%22,%22pathToVictory%22,%22mfStrengthOfSchedule%22,%22marginOfVictory%22,%22extendedNumWinsSoS%22,%22extendedFFGBattlePointsSoS%22,%22_id%22]'
    )
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        const eventData = JSON.parse(text);

        eventData.sort((a, b) => {
          const winsDifference = b.numWins - a.numWins;

          if (winsDifference === 0) {
            return b.battlePoints - a.battlePoints;
          }
          return winsDifference;
        });

        eventData.forEach((player, index) => {
          setData((oldData) => {
            setTitle(player.event.name);
            return [
              ...oldData,
              {
                userId: player.userId,
                name: `${player.firstName} ${player.lastName}`,
                rank: index + 1,
                points: player.battlePoints,
                wins: player.numWins,
                battlerounds: player.event.numberOfRounds,
                army: player.army.name,
                noPlayers: eventData.length,
                score:
                  ((eventData.length + 1 - (index + 1)) *
                    (50 +
                      15 * player.event.numberOfRounds -
                      (player.event.numberOfRounds - 3) * 5 +
                      (eventData.length > 130 ? 100 : eventData.length - 30) * 0.1)) /
                  eventData.length,
              },
            ];
          });
        });
      });
  };

  return (
    <Layout>
      <Header>
        <Typography.Title level={1} style={{ color: 'white' }}>
          DTC Prototype
        </Typography.Title>
      </Header>
      <Content style={{ padding: '32px' }}>
        <Row>
          <Col span={18} push={3}>
            <Row>
              <Col span={16}>
                <Input name={'ids'} placeholder={"List of event ID's comma seperated"}></Input>
              </Col>
              <Col span={4}>
                <Button name={'go'} onClick={() => getData()}>
                  Go
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ paddingTop: '16px' }}>
          <Col span={18} push={3}>
            <Table columns={columns} dataSource={data} title={() => title}></Table>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default Main;
