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

//TODO creates an overrided method for render to have (OPtional)
//<Provider store={store}>
//{children}
//</Provider>

//TODO:
//mock the store, using the initial values from store.
//when mocking you'll be able to modify the state as needed
//i.e in this case: load state.accounts so you can see workin the condition (accounts.length > 0) that will load another button.
//this way we can control the E2E tests.

//todo also a handler for functions as chrome.i18n.getMessage
chrome.i18n.getMessage = jest
  .fn()
  .mockImplementation((...args) => 'from_getMessage');

describe('add-account-main.component tests:\n', () => {
  test('should first', () => {
    console.log(store.getState());
    const addAccountComponent = renderer.create(
      <Provider store={store}>
        <AddAccountMainComponent />
      </Provider>,
    );
    // const addAccountTree = addAccountComponent.toJSON();
    // console.log(addAccountTree);
    // const addComponentRoot = addAccountComponent.root;
    // addComponentRoot.children.forEach((children) => {
    //   console.log(children);
    // });
    //console.log(addComponentRoot.findByProps({ navigateTo: {} }));
    renderer.act(() => {
      const buttons = addAccountComponent.root.findAllByType('button');
      buttons[0].props.onClick();
      buttons.forEach((button) => {
        console.log(button.props);
      });
    });
    console.log(store.getState().navigation);
  });
});
