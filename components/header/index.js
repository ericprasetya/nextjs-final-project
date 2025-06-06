// 'use client';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useMutation } from '@/hooks/useMutation';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from '@/context/userContext';

// const Links = [
//   { name: 'Posts', path: '/posts' },
// ];
const NavLink = ({ path, children }) => {
  return (
    <Link href={path} passHref>
      <Box
        px={2}
        py={1}
        rounded="md"
        _hover={{
          textDecoration: 'none',
          bg: useColorModeValue('gray.200', 'gray.700'),
        }}
      >
        {children}
      </Box>
    </Link>
  );
};

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userData = useContext(UserContext)

  const {mutate} = useMutation();
  const router = useRouter();

  const HandleLogout= async () => {
    const response = await mutate({
      url: "https://service.pace-unv.cloud/api/logout",
      method: "POST",
      headers: {
        Authorization: "Bearer " + Cookies.get("user_token")
      }
    })
    if(response.success == true) {
      Cookies.remove("user_token");
      router.push("/login");
    }
  }
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <NavLink key={"home"} path={"/"}>Sanber Daily</NavLink>
            {/* <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link.name} path={link.path}>
                  {link.name}
                </NavLink>
              ))}
            </HStack> */}
          </HStack>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
                <Text>{userData?.name}</Text>
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Link href="/profile" passHref>
                    My Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/notifications" passHref>
                    Notifications
                  </Link>
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={HandleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.name} path={link.path}>
                  {link.name}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}

export default Header;
