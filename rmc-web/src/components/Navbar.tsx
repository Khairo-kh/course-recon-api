import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  let me = null;

  if (fetching) {
    me = null;
  } else if (!data?.getMe) {
    me = (
      <>
        <NextLink href="/login">
          <Link mx={'2'}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mx={'2'}>Register</Link>
        </NextLink>
      </>
    );
  } else {
    me = (
      <Flex gap={4}>
        <Box>{data.getMe.username}</Box>
        <Button
          variant="link"
          isLoading={logoutFetching}
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex bg="twitter.900" p={6}>
      <Box ml={'auto'} color="white">
        {me}
      </Box>
    </Flex>
  );
};
