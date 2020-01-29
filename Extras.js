import React, { Component } from 'react';
import SecureStorage from 'react-native-secure-storage'
import { StackActions } from 'react-navigation';
import { Container, Header, Content, List, ListItem, Text, Separator, Right, Card, CardItem, Left, Thumbnail, Body, Title, Icon, Button, Spinner } from 'native-base';
export default class Extras extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            name: null,
            roll: null,
            token: null,
            loading: false,
            data: [{ 'Message': 'extra', "value": 10, 'date': "12-23-23", 'token': 1 }]
        }
        this.fetchData = this.fetchData.bind(this)
    }

    async fetchData() {
        this.setState({
            loading: true
        })
        const token = await SecureStorage.getItem('token');
        const name = await SecureStorage.getItem('name');
        const roll = await SecureStorage.getItem('roll')
        let res = await fetch("http://nitc-mess.anandu.net/api/users/dues",
            {
                "credentials": "omit", "headers": { "accept": "*/*", "Authorization": `Bearer ${token}` },
                "method": "GET"
            }
        ).then(res => res.json())
        this.setState({
            data: res,
            name,
            roll,
            token
        })
    }
    async componentDidMount() {
        await this.fetchData();
        this.setState({
            isReady: true
        })
    }
    render() {
        if (this.state.data == null) {
            this.fetchData();
        }
        this.extras = this.state.data.map((data, key) =>
            <ListItem last key={key}>
                <Text>{data.message}</Text>
                <Text style={{ marginLeft: 'auto' }}>Rs.{data.amount}</Text>
                <Text style={{ marginLeft: 50 }}>{(new Date(data.updatedAt)).toLocaleDateString()}</Text>
            </ListItem>
        );
        this.sum = this.state.data.reduce((prev, cur) => cur.amount + prev, 0)

        return (
            <Container>
                <Content>
                    <Card style={{ margin: 0 }}>
                        <CardItem>
                            <Left>
                                <Thumbnail source={require('./assets/thumbnail.png')} />
                                <Body>
                                    <Text>{this.state.name}</Text>
                                    <Text note>{this.state.roll}</Text>
                                </Body>
                            </Left>
                            <Right>
                                <Button icon transparent onPress={async () => {
                                    await SecureStorage.removeItem('token');
                                    const Home = StackActions.replace({
                                        routeName: 'Home'
                                    });
                                    this.props.navigation.dispatch(Home);
                                }}>
                                    <Icon name="sign-out-alt" type='FontAwesome5' />
                                </Button>
                            </Right>
                        </CardItem>
                    </Card>
                    {this.extras}
                </Content>
                <ListItem />
                <Spinner style={{ display: this.state.isReady ? 'none' : 'flex' }} />
                <ListItem />
                <Content style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                    <Card>
                        <CardItem>
                            <Body>
                                <Text style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
                                    TOTAL:    Rs. {this.sum}
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}