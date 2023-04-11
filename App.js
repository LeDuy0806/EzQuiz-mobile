import * as React from 'react';
import { ReactDOM } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from 'src/reducers';
import RootNavigator from 'src/navigation/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

export default function App(props) {
    // return <RootNavigation />;

    return (
        <Provider store={store}>
            <RootNavigator {...props} />
        </Provider>
    );

    // return <BottomNavigator {...props} />;
}
