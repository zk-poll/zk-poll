import * as React from "react";
import styled from "styled-components";
import Header from "../../components/header";
import {
  Card,
  Button,
  Text,
  Grid,
  GridItem,
  Center,
  Input,
  Box,
} from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getAccount } from "@wagmi/core";
import { generateProof } from "../../components/generateProof";
import { castVote } from "../../components/castVote";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  useContract,
  useWaitForTransaction,
  useSigner,
  useContractRead,
} from "wagmi";
import testABI from "../../components/abi/test.json";
import { Progress } from "@chakra-ui/react";
import { PieChart } from "react-minimal-pie-chart";

interface IPoll {
  title: string;
  author: string;
  groupDescription: string;
  description: string;
  votes: number;
  id: number;
  createdAt: number;
  deadline: number;
  active: boolean;
}

const account = getAccount();
const SEMAPHORE_CONTRACT = process.env.NEXT_PUBLIC_GOERLI_POLL_CONTRACT;

function PollDisplay() {
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [yesSelected, setYesSelected] = useState(false);
  const [noSelected, setNoSelected] = useState(false);
  const [proofForTx, setProofForTx] = useState<string[]>([]);
  const [nullifierHash, setNullifierHash] = useState<string>("");
  const [proofResponse, setProofResponse] = useState<string>("");
  const [loadingProof, setLoadingProof] = useState<boolean>(false);
  const [loadingSubmitVote, setLoadingSubmitVote] = useState<boolean>(false);
  const [yesVoteCount, setYesVoteCount] = useState<number>(0);
  const [noVoteCount, setNoVoteCount] = useState<number>(0);
  const [txHash, setTxHash] = useState<string>("");
  const toast = useToast();
  const router = useRouter();
  const { id } = router.query;
  const { data, isError, isLoading } = useWaitForTransaction({
    hash: `0x${txHash}`,
  });
  console.log(id);

  const {
    data: resultData,
    isError: isResultError,
    isLoading: isResultLoading,
  } = useContractRead({
    address: SEMAPHORE_CONTRACT,
    abi: testABI,
    functionName: "getPollState",
    args: [id],
  });
  console.log("RESULT DATA", resultData);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setYesSelected(e.currentTarget.textContent === "Yes" ? true : false);
    setNoSelected(e.currentTarget.textContent === "No" ? true : false);
  };

  const [poll, setPoll] = useState<IPoll>({
    id: -1,
    title: "",
    groupDescription: "",
    description: "",
    createdAt: 0,
    deadline: 0,
    active: false,
    author: "",
    votes: 1,
  });

  useEffect(() => {
    if (resultData) {
      setYesVoteCount(Number((resultData as number[])[0]));
      console.log("yes votes", yesVoteCount);
      setNoVoteCount(Number((resultData as number[])[1]));
      console.log("no votes", noVoteCount);
    }
    if (!id) return;
    const postData = async () => {
      const body = {
        data: {
          id,
        },
      };
      console.log("GOT INTO POST DATA", body);
      const response = await fetch("/api/getPoll", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((res) => res.json());
      console.log(response);
      setPoll(response);
    };
    postData();
  }, [id, resultData]);

  const handleGenProof = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (account) {
      // 1: Vote yes, 1: Poll ID
      setLoadingProof(true);
      // Hardcode these differently depending on pollID
      const response = await generateProof(
        privateKey,
        publicKey as `0x${string}`,
        yesSelected ? 1 : 0,
        Number(id)
      );
      const proofForTx = response[0];
      const nullifierHash = response[1];
      setProofForTx(proofForTx);
      setNullifierHash(nullifierHash);
      toast({
        title: "Proof generated!",
        description: "Find proof in console.",
        status: "success",
        duration: 5000,
        isClosable: true,
        containerStyle: {
          width: "700px",
          maxWidth: "90%",
        },
      });
      console.log("Proof Details: ", proofForTx);
      setLoadingProof(false);
      setProofResponse(proofForTx);
      console.log("SET TO THIS PROOF RESPONSE", proofResponse);
    }
  };

  const handleSubmitVote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (account) {
      setLoadingSubmitVote(true);
      const response = await castVote(nullifierHash, proofForTx, yesSelected? 1: 0, Number(id));
      const success = response[3]
      const txHash = response[1];
      setTxHash(txHash);
      if (success) {
        toast({
          title: "Vote casted!",
          description: txHash,
          status: "success",
          duration: 5000,
          isClosable: true,
          containerStyle: {
            width: "700px",
            maxWidth: "90%",
          },
        });
      } else {
        toast({
          title: "Transaction failed",
          description: txHash,
          status: "error",
          duration: 5000,
          isClosable: true,
          containerStyle: {
            width: "700px",
            maxWidth: "90%",
          },
        });
      }

      setLoadingSubmitVote(false);
      setProofResponse("");
    }
  };

  return (
    <Card backgroundColor={"#f4f4f8"} variant={"elevated"} margin={8}>
      <Grid
        templateAreas={`"header header"
                        "main nav"
                        "footer nav"
                        "extra extra"
                        "extra extra"
                        `}
        gridTemplateRows={"8% 2em 20% 9em"}
        gridTemplateColumns={"95% 2em "}
        // h='150%'
        gap="1"
        color="#242124"
        padding={4}
        margin={2}
        marginLeft={0}
      >
        <GridItem pl="2" area={"header"}>
          <Flex>
            <Text
              fontSize="xs"
              color={"#666666"}
              fontFamily={
                '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu'
              }
            >
              POLL ID {poll.id} | {poll.createdAt}
            </Text>
            <Spacer />
            {poll.active ? (
              <Button disabled={true} size="xs" colorScheme="yellow">
                Active
              </Button>
            ) : (
              <Button disabled={true} size="xs" colorScheme="green">
                Complete
              </Button>
            )}
          </Flex>
        </GridItem>
        <GridItem pl="2" area={"main"}>
          <Text fontSize="2xl" fontWeight="700">
            {poll.title}
          </Text>
        </GridItem>
        <GridItem pl="2" area={"footer"}>
          <Text>{poll.description}</Text>
          <Text fontSize="xs">{poll.groupDescription}</Text>
        </GridItem>
        <GridItem pl="2" area={"extra"}>
          <Input
            mr={4}
            mb={4}
            placeholder="Public Key"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
          />
          <Spacer />
          <Input
            mr={4}
            mb={4}
            placeholder="Private Key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
          <Spacer />
          <Center>
            <Flex>
              <Button
                size="md"
                variant="outline"
                isActive={yesSelected}
                colorScheme="green"
                mr={4}
                onClick={handleClick}
              >
                Yes
              </Button>
              <Button
                mb={3}
                size="md"
                variant="outline"
                isActive={noSelected}
                colorScheme="red"
                onClick={handleClick}
              >
                No
              </Button>
              <Button
                mb={3}
                ml={4}
                disabled={account && (yesSelected || noSelected) && proofResponse == "" ? false : true}
                onClick={handleGenProof}
                loadingText="Generating Proof"
                isLoading={loadingProof}
                colorScheme="teal"
                variant="outline"
              >
                Generate Proof
              </Button>
              <Button
                mb={3}
                ml={4}
                disabled={account && proofResponse ? false : true}
                onClick={handleSubmitVote}
                loadingText="Submitting Vote"
                isLoading={loadingSubmitVote}
                colorScheme="teal"
                variant="outline"
              >
                Submit Vote
              </Button>
            </Flex>
          </Center>
          {yesVoteCount + noVoteCount > 0 ? (
            <>
              <Progress
                colorScheme={"green"}
                background={"red"}
                height="10px"
                rounded={"xl"}
                mb={"1%"}
                value={(100 * yesVoteCount) / (yesVoteCount + noVoteCount)}
              />
              <Text
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
              >
                Yes: {yesVoteCount} No: {noVoteCount}
              </Text>
            </>
          ) : null}
          <Spacer />
        </GridItem>
      </Grid>
    </Card>
  );
}

const StyledDiv = styled.div`
  transition: all 0.1s ease-in-out;
  border-radius: 8px;
  border: 1px solid #eaeaea;

  &:hover {
    border-color: #0d76fc;
  }
`;

export default function GeneratePoll() {
  return (
    <>
      <Header />
      <Center>
        <StyledDiv>
          <PollDisplay />
        </StyledDiv>
      </Center>
    </>
  );
}