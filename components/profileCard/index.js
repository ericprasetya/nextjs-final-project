// components/ProfileCard.js

import React from "react";
import { Box, Flex, Heading, Divider, Text, useColorModeValue } from "@chakra-ui/react";

const ProfileCard = ({ userData }) => {
  const formBackground = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex justifyContent="center" p={6}>
      <Box
        p={6}
        w="full"
        borderWidth={1}
        borderRadius="lg"
        overflow="hidden"
        boxShadow="lg"
        bg={formBackground}
      >
        <Flex justifyContent="center" mb={4}></Flex>
        <Heading fontSize="xl" textAlign="center">
          {userData?.name}
        </Heading>
        <Divider mb={4} />
        <Flex justifyContent="space-evenly">
          <Text>
            <strong>Email:</strong> {userData?.email}
          </Text>
          <Text>
            <strong>Phone:</strong> {userData?.phone}
          </Text>
          <Text>
            <strong>Hobby:</strong> {userData?.hobby}
          </Text>
          <Text>
            <strong>Joined:</strong>{" "}
            {new Date(userData?.created_at).toLocaleDateString()}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default ProfileCard;
