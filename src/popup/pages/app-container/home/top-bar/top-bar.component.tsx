import { refreshActiveAccount } from '@popup/actions/active-account.actions';
import { loadGlobalProperties } from '@popup/actions/global-properties.actions';
import {
  addToLoadingList,
  removeFromLoadingList,
} from '@popup/actions/loading.actions';
import { setInfoMessage } from '@popup/actions/message.actions';
import { forgetMk } from '@popup/actions/mk.actions';
import { navigateTo, resetNav } from '@popup/actions/navigation.actions';
import { Icons } from '@popup/icons.enum';
import { RootState } from '@popup/store';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Icon, { IconType } from 'src/common-ui/icon/icon.component';
import { Screen } from 'src/reference-data/screen.enum';
import ActiveAccountUtils from 'src/utils/active-account.utils';
import FormatUtils from 'src/utils/format.utils';
import HiveUtils from 'src/utils/hive.utils';
import './top-bar.component.scss';

const TopBar = ({
  forgetMk,
  navigateTo,
  resetNav,
  refreshActiveAccount,
  activeAccount,
  globalProperties,
  addToLoadingList,
  removeFromLoadingList,
  loadGlobalProperties,
  setInfoMessage,
}: PropsFromRedux) => {
  const [hasRewardToClaim, setHasRewardToClaim] = useState(false);
  const [rotateLogo, setRotateLogo] = useState(false);

  useEffect(() => {
    if (!ActiveAccountUtils.isEmpty(activeAccount)) {
      setHasRewardToClaim(
        ActiveAccountUtils.hasReward(
          activeAccount.account.reward_hbd_balance as string,
          FormatUtils.toHP(
            activeAccount.account.reward_vesting_balance
              .toString()
              .replace('VESTS', ''),
            globalProperties.globals,
          ).toString(),
          activeAccount.account.reward_hive_balance as string,
        ),
      );
    }
  }, [activeAccount]);

  const refresh = () => {
    setRotateLogo(true);
    refreshActiveAccount();
    loadGlobalProperties();
    setTimeout(() => setRotateLogo(false), 1000);
  };

  const lockPopup = (): void => {
    resetNav();
    forgetMk();
  };

  const claim = async (): Promise<void> => {
    addToLoadingList('popup_html_claiming_rewards');
    const claimSuccessful = await HiveUtils.claimRewards(
      activeAccount,
      activeAccount.account.reward_hive_balance,
      activeAccount.account.reward_hbd_balance,
      activeAccount.account.reward_vesting_balance,
    );
    if (claimSuccessful) {
      removeFromLoadingList('popup_html_claiming_rewards');
      setHasRewardToClaim(false);
      setTimeout(() => {
        refreshActiveAccount();
      }, 2000);
    }
  };

  const copyUsernameToClipboard = (event: SyntheticEvent) => {
    event.nativeEvent.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    event.nativeEvent.preventDefault();
    navigator.clipboard.writeText(activeAccount.name!);
    setInfoMessage('popup_html_text_copied', [activeAccount.name!]);
  };

  return (
    <div className="top-bar">
      <img
        className={rotateLogo ? 'rotate' : ''}
        src="/assets/images/keychain_icon_small.png"
        onClick={refresh}
      />
      <div className="spacer"></div>
      <Icon
        additionalClassName="copy-username-button"
        name={Icons.COPY}
        type={IconType.OUTLINED}
        onClick={copyUsernameToClipboard}
        tooltipMessage="popup_html_copy_username_tooltip_text"
      />

      {hasRewardToClaim && (
        <Icon
          name={Icons.CLAIM}
          onClick={() => claim()}
          additionalClassName="button claim-button"
          type={IconType.STROKED}></Icon>
      )}
      <Icon
        name={Icons.LOGOUT}
        onClick={() => lockPopup()}
        additionalClassName="button lock-button"
        type={IconType.STROKED}></Icon>
      <Icon
        name={Icons.MENU}
        onClick={() => navigateTo(Screen.SETTINGS_MAIN_PAGE)}
        additionalClassName="button settings-button"
        type={IconType.STROKED}></Icon>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.activeAccount,
    globalProperties: state.globalProperties,
  };
};

const connector = connect(mapStateToProps, {
  forgetMk,
  navigateTo,
  resetNav,
  refreshActiveAccount,
  addToLoadingList,
  removeFromLoadingList,
  loadGlobalProperties,
  setInfoMessage,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const TopBarComponent = connector(TopBar);
