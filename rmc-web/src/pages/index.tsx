import { Box } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { Navbar } from '../components/Navbar';
import { useRatingsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [{ data }] = useRatingsQuery();
  return (
    <>
      <Navbar />
      <Box>Hello Chakra!</Box>
      {!data
        ? null
        : data.ratings.map((rating) => (
            <Box key={rating.id}>{rating.title}</Box>
          ))}
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
