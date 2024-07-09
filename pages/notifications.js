import React from "react";
import { SimpleGrid } from "@chakra-ui/react";
import NotificationCard from "@/components/notificationCard";
import { useQueries } from "@/hooks/useQueries";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";

const LayoutComponent = dynamic(() => import("@/layout"));

const NotificationsPage = () => {
  const { data, isLoading, isError } = useQueries({
    prefixUrl: "https://service.pace-unv.cloud/api/notifications",
    headers: {
      Authorization: "Bearer " + Cookies.get("user_token"),
    },
  });
  console.log("data => ", data);

  return (
    <LayoutComponent metaTitle="Notifications">

    <SimpleGrid columns={[1, null, 2]} spacing={4} p={4}>
      {data?.data.map((notification) => (
        <NotificationCard key={notification.id} 
          notification={notification}
        />
      ))}
    </SimpleGrid>
    </LayoutComponent>
  );
};

export default NotificationsPage;
