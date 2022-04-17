import { Box } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { Navbar } from '../components/Navbar';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  return (
    <>
      <Navbar />
      <Box>Hello Chakra!</Box>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
