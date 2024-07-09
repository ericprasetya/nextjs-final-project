import React from "react";
import { Box, Text, Flex, Avatar } from "@chakra-ui/react";
import { formatDistanceToNow } from 'date-fns';

const NotificationCard = ({ notification }) => {// Format time difference
  const formattedTime = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });
  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="md"
      bg="white"
      boxShadow="sm"
      display="flex"
      alignItems="center"
    >
      <Flex alignItems="center" mr={4}>
        <Box
          borderRadius="full"
          bg="gray.200"
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Avatar name={notification.user.name} size="xs" mr={2} />
          <Text fontSize="sm" fontWeight="bold" color="black">
            {notification.user.name}
          </Text>
        </Box>
      </Flex>
      <Flex flexDir="column">
        <Text fontWeight="bold">{name}</Text>
        <Text>
          {notification.remark == "like" ? "liked your post" : "replied your post"}, <i>{formattedTime}</i>
        </Text>
      </Flex>
    </Box>
  );
};

export default NotificationCard;
