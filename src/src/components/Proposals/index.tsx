import { PartialProposal, ProposalState, useProposalThreshold } from '../../wrappers/nounsDao';
import { Alert, Button } from 'react-bootstrap';
import ProposalStatus from '../ProposalStatus';
import classes from './Proposals.module.css';
import { useNavigate } from 'react-router-dom';
import { useBlockNumber, useEthers } from '@usedapp/core';
import clsx from 'clsx';
import { Trans } from '@lingui/macro';
import proposalStatusClasses from '../ProposalStatus/ProposalStatus.module.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { i18n } from '@lingui/core';

// TODO LOCALE:

dayjs.extend(relativeTime);
const AVERAGE_BLOCK_TIME_IN_SECS = 12;

const getCountdownCopy = (
  proposal: PartialProposal,
  currentBlock: number
  ) => {
  const timestamp = Date.now();
  const startDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.startBlock - currentBlock),
          'seconds',
        )
      : undefined;

  const endDate =
    proposal && timestamp && currentBlock
      ? dayjs(timestamp).add(
          AVERAGE_BLOCK_TIME_IN_SECS * (proposal.endBlock - currentBlock),
          'seconds',
        )
      : undefined;

  const expiresDate = proposal && dayjs(proposal.eta).add(14, 'days');

  const now = dayjs();

  if (startDate?.isBefore(now) && endDate?.isAfter(now)) {
    return (
      <Trans>
        Ends {endDate.fromNow()}
      </Trans>
    );
  }
  if (endDate?.isBefore(now)) {
    return (
      <Trans>
        Expires {expiresDate.fromNow()}
      </Trans>
    );
  }
  return (
    <Trans>
      Starts{' '}
      {dayjs(startDate)
        .fromNow()}
    </Trans>
  );
};

const Proposals = ({ proposals }: { proposals: PartialProposal[] }) => {
  const navigate = useNavigate();

  const { account } = useEthers();
//   const connectedAccountNounVotes = useUserVotes() || 0;
  const currentBlock = useBlockNumber();
  // const activeLocale = useActiveLocale();
  const [showDelegateModal, setShowDelegateModal] = useState(false);

  // const threshold = (useProposalThreshold() ?? 0) + 1;
//   const hasEnoughVotesToPropose = account !== undefined && connectedAccountNounVotes >= threshold;
//   const hasNounBalance = (useUserNounTokenBalance() ?? 0) > 0;

  const nullStateCopy = () => {
    if (account !== null) {
      return <Trans>You have no Votes.</Trans>;
    }
    return <Trans>Connect wallet to make a proposal.</Trans>;
  };

  return (
    <div className={classes.proposals}>
      <div
        className={clsx(
          classes.headerWrapper,
          classes.forceFlexRow,
        )}
      >
        <h3 className={classes.heading}>
          <Trans>Proposals</Trans>
        </h3>
        {(
          <div className={classes.nounInWalletBtnWrapper}>
            <div className={classes.submitProposalButtonWrapper}>
              <Button
                className={classes.generateBtn}
                onClick={() => navigate('/create-proposal')}
              >
                <Trans>Submit Proposal</Trans>
              </Button>
            </div>
          </div>
        )}
      </div>
      {<div className={classes.nullStateCopy}>{nullStateCopy()}</div>}
      {proposals?.length ? (
        proposals
          .slice(0)
          .reverse()
          .map((p, i) => {
            const isPropInStateToHaveCountDown =
              p.status === ProposalState.PENDING ||
              p.status === ProposalState.ACTIVE ||
              p.status === ProposalState.QUEUED;

            const countdownPill = (
              <div className={classes.proposalStatusWrapper}>
                <div className={clsx(proposalStatusClasses.proposalStatus, classes.countdownPill)}>
                  <div className={classes.countdownPillContentWrapper}>
                    {/* <span className={classes.countdownPillClock}>
                      <ClockIcon height={16} width={16} />
                    </span>{' '} */}
                    <span className={classes.countdownPillText}>
                      {getCountdownCopy(p, currentBlock || 0)}
                    </span>
                  </div>
                </div>
              </div>
            );

            return (
              <a
                className={clsx(classes.proposalLink, classes.proposalLinkWithCountdown)}
                href={`/vote/${p.id}`}
                key={i}
              >
                <div className={classes.proposalInfoWrapper}>
                  <span className={classes.proposalTitle}>
                    <span className={classes.proposalId}>{i18n.number(parseInt(p.id || '0'))}</span>{' '}
                    <span>{p.title}</span>
                  </span>

                  {isPropInStateToHaveCountDown && (
                    <div className={classes.desktopCountdownWrapper}>{countdownPill}</div>
                  )}
                  <div className={clsx(classes.proposalStatusWrapper, classes.votePillWrapper)}>
                    <ProposalStatus status={p.status}></ProposalStatus>
                  </div>
                </div>

                {isPropInStateToHaveCountDown && (
                  <div className={classes.mobileCountdownWrapper}>{countdownPill}</div>
                )}
              </a>
            );
          })
      ) : (
        <Alert variant="secondary">
          <Alert.Heading>
            <Trans>No proposals found</Trans>
          </Alert.Heading>
          <p>
            <Trans>Proposals submitted by community members will appear here.</Trans>
          </p>
        </Alert>
      )}
    </div>
  );
};
export default Proposals;
