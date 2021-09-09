import {
  setErrorMessage,
  setSuccessMessage,
} from '@popup/actions/message.actions';
import {
  navigateTo,
  navigateToWithParams,
} from '@popup/actions/navigation.actions';
import { RootState } from '@popup/store';
import React, { useEffect, useState } from 'react';
import Select, {
  SelectItemRenderer,
  SelectRenderer,
} from 'react-dropdown-select';
import { connect, ConnectedProps } from 'react-redux';
import ButtonComponent from 'src/common-ui/button/button.component';
import { InputType } from 'src/common-ui/input/input-type.enum';
import InputComponent from 'src/common-ui/input/input.component';
import { PageTitleComponent } from 'src/common-ui/page-title/page-title.component';
import SwitchComponent from 'src/common-ui/switch/switch.component';
import { Screen } from 'src/reference-data/screen.enum';
import CurrencyUtils, { CurrencyLabels } from 'src/utils/currency.utils';
import FormatUtils from 'src/utils/format.utils';
import HiveUtils from 'src/utils/hive.utils';
import './transfer-fund.component.scss';

interface CurrencyListItem {
  label: string;
  value: keyof CurrencyLabels;
}

const TransferFunds = ({
  activeAccount,
  navParams,
  currencyLabels,
  setErrorMessage,
  setSuccessMessage,
  navigateToWithParams,
  navigateTo,
}: PropsFromRedux) => {
  const [receiverUsername, setReceiverUsername] = useState('');
  const [amount, setAmount] = useState(0.0);
  const [balance, setBalance] = useState<string | number>('...');
  const [selectedCurrency, setSelectedCurrency] = useState<
    keyof CurrencyLabels
  >(navParams.selectedCurrency);
  const [memo, setMemo] = useState('');
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [frequency, setFrequency] = useState(0);
  const [iteration, setIterations] = useState(0);

  let balances = {
    hive: FormatUtils.formatCurrencyValue(activeAccount.account.balance),
    hbd: FormatUtils.formatCurrencyValue(activeAccount.account.hbd_balance),
    hp: 0,
  };

  useEffect(() => {
    setBalance(balances[selectedCurrency]);
  }, [selectedCurrency]);

  const options = [
    { label: currencyLabels.hive, value: 'hive' as keyof CurrencyLabels },
    { label: currencyLabels.hbd, value: 'hbd' as keyof CurrencyLabels },
  ];

  const setAmountToMaxValue = () => {
    setAmount(parseFloat(balance.toString()));
  };

  const handleClickOnSend = () => {
    if (parseFloat(amount.toString()) > parseFloat(balance.toString())) {
      setErrorMessage('popup_html_power_up_down_error');
      return;
    }

    const formattedAmount = `${amount.toFixed(3)} ${
      currencyLabels[selectedCurrency]
    }`;

    navigateToWithParams(Screen.CONFIRMATION_TRANSFER_PAGE, {
      transferInfo: {
        formattedAmount,
        memo,
        receiverUsername,
        sender: activeAccount.name,
        frequency,
        iteration,
        isRecurrent,
      },
      afterConfirmAction: async () => {
        let success = false;

        await HiveUtils.transfer(
          activeAccount.name!,
          receiverUsername,
          formattedAmount,
          memo,
          isRecurrent,
          iteration,
          frequency,
        );

        navigateTo(Screen.HOME_PAGE, true);
        if (success) {
          setSuccessMessage('popup_html_transfer_successful');
        } else {
          setErrorMessage('popup_html_transfer_failed');
        }
      },
    });
  };

  const customLabelRender = (selectProps: SelectRenderer<CurrencyListItem>) => {
    return (
      <div
        className="selected-currency"
        onClick={() => {
          selectProps.methods.dropDown('close');
        }}>
        {currencyLabels[selectedCurrency]}
      </div>
    );
  };
  const customItemRender = (
    selectProps: SelectItemRenderer<CurrencyListItem>,
  ) => {
    return (
      <div
        className={`select-account-item ${
          selectedCurrency === selectProps.item.value ? 'selected' : ''
        }`}
        onClick={() => {
          setSelectedCurrency(selectProps.item.value);
          selectProps.methods.dropDown('close');
        }}>
        <div className="currency">{selectProps.item.label}</div>
      </div>
    );
  };

  return (
    <div className="transfer-funds-page">
      <PageTitleComponent
        title="popup_html_transfer_funds"
        isBackButtonEnabled={true}
      />
      <div className="balance-panel">
        <div className="balance-label">
          {chrome.i18n.getMessage(
            'popup_html_balance',
            currencyLabels[selectedCurrency],
          )}
        </div>
        <div className="balance-value">{balance}</div>
      </div>
      <InputComponent
        type={InputType.TEXT}
        logo="arobase"
        placeholder="popup_html_username"
        value={receiverUsername}
        onChange={setReceiverUsername}
      />
      <div className="value-panel">
        <div className="value-input-panel">
          <InputComponent
            type={InputType.NUMBER}
            placeholder="0.000"
            skipTranslation={true}
            value={amount}
            onChange={setAmount}
          />
          <div className="max" onClick={setAmountToMaxValue}>
            {chrome.i18n.getMessage('popup_html_send_max')}
          </div>
        </div>
        <Select
          values={[]}
          options={options}
          onChange={() => undefined}
          contentRenderer={customLabelRender}
          itemRenderer={customItemRender}
          className="select-currency"
        />
      </div>

      <InputComponent
        type={InputType.TEXT}
        placeholder="popup_html_memo_optional"
        value={memo}
        onChange={setMemo}
      />
      <SwitchComponent
        title="popup_html_recurrent_transfer"
        checked={isRecurrent}
        onChange={setIsRecurrent}></SwitchComponent>
      {isRecurrent && (
        <div className="recurrent-panel">
          <InputComponent
            type={InputType.NUMBER}
            placeholder="popup_html_recurrent_transfer_frequency"
            min={24}
            step={1}
            value={frequency}
            onChange={setFrequency}
            hint={'popup_html_recurrent_transfer_frequency'}
          />
          <InputComponent
            type={InputType.NUMBER}
            placeholder="popup_html_recurrent_transfer_iterations"
            min={1}
            step={1}
            value={iteration}
            onChange={setIterations}
            hint={'popup_html_recurrent_transfer_iterations_hint'}
          />
        </div>
      )}
      <ButtonComponent
        label={'popup_html_send_transfer'}
        onClick={handleClickOnSend}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.activeAccount,
    currencyLabels: CurrencyUtils.getCurrencyLabels(state.activeRpc?.testnet!),
    navParams: state.navigation.params,
  };
};

const connector = connect(mapStateToProps, {
  setErrorMessage,
  setSuccessMessage,
  navigateToWithParams,
  navigateTo,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const TransferFundsComponent = connector(TransferFunds);
