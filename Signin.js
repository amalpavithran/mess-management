import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Text, Button, Content, Header, Form, Item, Input, Label, Left, Body, Title, Spinner, View } from 'native-base';
import { StyleSheet, ScrollView, AppRegistry } from 'react-native'
import SecureStorage from 'react-native-secure-storage';
import { StackActions } from 'react-navigation';
import Extras from './Extras';

export default class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            email: null,
            pass: null,
            error: null,
            validSession: false,
            loading: 'none',
        };
        this.persistance = this.persistance.bind(this)
        this.loginError = this.loginError.bind(this)
        this.setLoading = this.setLoading.bind(this)
        this.persistance();
    }

    setLoading() {
        this.setState({
            loading: 'flex'
        })
    }
    async persistance() {
        const token = await SecureStorage.getItem('token');
        console.log(token);
        if (token != null) {
            fetch("http://nitc-mess.anandu.net/api/users/dues", { "credentials": "omit", "headers": { "accept": "*/*", "Authorization": `Bearer ${token}` }, "method": "GET" })
                .then(res => res.json())
            this.setState({
                validSession: true
            })
        } else {
            this.setState({
                validSession: false
            })
        }
        console.log("test")
    }
    loginError(message) {
        this.setState({
            error: message
        })
    }
    // async componentDidMount() {
    //     await Font.loadAsync({
    //         Roboto: require('native-base/Fonts/Roboto.ttf'),
    //         Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    //     });
    //     this.setState({ isReady: true });
    // }

    render() {
        if (this.state.validSession) {
            const navigate = StackActions.replace({
                routeName: 'Extras'
            });
            this.props.navigation.dispatch(navigate);
            return null
        } else {
            return (
                <ScrollView>
                    <Header>
                        <Left />
                        <Body>
                            <Title>Mess Management</Title>
                            {/* <Subtitle>Code.init()</Subtitle> */}
                        </Body>
                    </Header>
                    <Container style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <Content>
                            <View style={{ flexGrow: 1, alignItems: 'center' }}>
                                <Image source={require('./assets/icon1.png')} style={{ width: 100, height: 100 }} />
                            </View>
                            <Form style={styles.form}>
                                <Item floatingLabel>
                                    <Label>Email</Label>
                                    <Input keyboardType='email-address' onChangeText={(text) => { this.state.email = text }} />
                                </Item>
                                <Item floatingLabel>
                                    <Label>Password</Label>
                                    <Input secureTextEntry={true} onChangeText={(text) => { this.state.pass = text }} />
                                </Item>
                                <Button style={styles.button}
                                    onPress={() => {
                                        this.setState({
                                            loading: 'flex'
                                        })
                                        let resCode = null;
                                        fetch('http://nitc-mess.anandu.net' + '/api/auth/signin', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                'email': this.state.email,
                                                "password": this.state.pass,
                                            })
                                        })
                                            .then(data => {
                                                resCode = data.status;
                                                return data.json();
                                            })
                                            .then(async res => {
                                                if (resCode === 200) {
                                                    const token = res.token;
                                                    console.log(token);
                                                    await SecureStorage.setItem('token', token);
                                                    await SecureStorage.setItem('name', res.user.name);
                                                    await SecureStorage.setItem('roll', res.user.rollNumber);
                                                    const navigate = StackActions.replace({
                                                        routeName: 'Extras'
                                                    });
                                                    this.props.navigation.dispatch(navigate);
                                                } else {
                                                    this.loginError(res.errors.message);
                                                    console.log(res.errors.message)
                                                }
                                                this.setState({
                                                    loading: 'none'
                                                })
                                            })
                                    }}>
                                    <Text>Submit</Text>
                                </Button>
                                <Button style={styles.button}
                                    onPress={async () => {
                                        this.props.navigation.navigate('Signup')
                                    }}>
                                    <Text>Sign Up</Text>
                                </Button>
                            </Form>
                            <Spinner style={{ display: this.state.loading }} />
                            <Text style={styles.error}>{this.state.error}</Text>
                            <Body />
                        </Content>
                    </Container>
                </ScrollView>
            );
        }
    }
}

const styles = StyleSheet.create({
    form: {
        margin: 10,
        marginBottom: 20,
    },
    button: {
        flexGrow: 1,
        marginTop: 30,
        justifyContent: "center",
        borderRadius: 7
    },
    error: {
        color: 'red',
        flexGrow: 1,
        textAlign: 'center',
    }
});
