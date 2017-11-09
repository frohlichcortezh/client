// @flow
import * as Constants from '../../../constants/chat'
import * as ChatGen from '../../../actions/chat-gen'
import {List} from 'immutable'
import {ChannelHeader, UsernameHeader} from '.'
import {branch, compose, renderComponent, connect, type TypedState} from '../../../util/container'
import {createSelector} from 'reselect'
import {showUserProfile} from '../../../actions/profile'
import {chatTab} from '../../../constants/tabs'
import {type OwnProps} from './container'
import * as ChatTypes from '../../../constants/types/flow-types-chat'

const getUsers = createSelector(
  [Constants.getYou, Constants.getTLF, Constants.getFollowingMap, Constants.getMetaDataMap],
  (you, tlf, followingMap, metaDataMap) =>
    Constants.usernamesToUserListItem(
      Constants.participantFilter(List(tlf.split(',')), you).toArray(),
      you,
      metaDataMap,
      followingMap
    )
)

const mapStateToProps = (state: TypedState, {infoPanelOpen}: OwnProps) => ({
  badgeNumber: state.notifications.get('navBadges').get(chatTab),
  canOpenInfoPanel: !Constants.isPendingConversationIDKey(Constants.getSelectedConversation(state) || ''),
  channelName: Constants.getChannelName(state),
  muted: Constants.getMuted(state),
  infoPanelOpen,
  teamName: Constants.getTeamName(state),
  users: getUsers(state),
  smallTeam: Constants.getTeamType(state) === ChatTypes.commonTeamType.simple,
})

const mapDispatchToProps = (dispatch: Dispatch, {onBack, onToggleInfoPanel}: OwnProps) => ({
  onBack,
  onOpenFolder: () => dispatch(ChatGen.createOpenFolder()),
  onShowProfile: (username: string) => dispatch(showUserProfile(username)),
  onToggleInfoPanel,
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  branch(props => props.channelName && props.teamName, renderComponent(ChannelHeader))
)(UsernameHeader)
