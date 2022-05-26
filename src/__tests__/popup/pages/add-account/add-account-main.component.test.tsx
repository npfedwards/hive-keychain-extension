import { AddAccountMainComponent } from '@popup/pages/add-account/add-account-main/add-account-main.component';
import { store } from '@popup/store';
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
const chrome = require('chrome-mock');
global.chrome = chrome;

afterAll(() => {
  jest.clearAllMocks();
});

//TODO creates an overrided method for render to have
//<Provider store={store}>
//{children}
//</Provider>

//todo also a handler for functions as chrome.i18n.getMessage
chrome.i18n.getMessage = jest
  .fn()
  .mockImplementation((...args) => 'from_getMessage');

describe('add-account-main.component tests:\n', () => {
  test('should first', () => {
    const addAccountComponent = renderer.create(
      <Provider store={store}>
        <AddAccountMainComponent />
      </Provider>,
    );
    // const addAccountTree = addAccountComponent.toJSON();
    // console.log(addAccountTree);
    const addComponentRoot = addAccountComponent.root;
    console.log(addComponentRoot.findByProps({ navigateTo: {} }));
  });
});
