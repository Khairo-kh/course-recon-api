import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  GridItem,
  SimpleGrid,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import PageWrapper from '../components/PageWrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const ForgotPassword: React.FC<{}> = ({}) => {
  const [requested, setRequested] = useState(false);
  const [, ForgotPassword] = useForgotPasswordMutation();
  return (
    <PageWrapper variant="regular">
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          await ForgotPassword({ email: values.email });
          setRequested(true);
        }}
      >
        {({ isSubmitting }) =>
          requested ? (
            <Box>
              Done! if the email you provided has an associated account you will
              receive an email with reset password instruction
            </Box>
          ) : (
            <Form>
              <Flex
                justifyContent="center"
                alignItems="center"
                minH="80vh"
                h="100%"
              >
                <Box bg="white" borderRadius={10} p={10}>
                  <SimpleGrid columns={4} columnGap={2} spacing={4}>
                    <GridItem colSpan={4}>
                      <FormControl>
                        <InputField
                          name="email"
                          label="Email"
                          placeholder="john.doe@mail.com"
                          _size="lg"
                        />
                        <FormHelperText color="gray.500" p={1}>
                          Enter the email associated with your account
                        </FormHelperText>
                      </FormControl>
                    </GridItem>

                    <GridItem colSpan={4}>
                      <Center>
                        <Button
                          type="submit"
                          variant="solid"
                          color="white"
                          bg="telegram.600"
                          _hover={{ bg: 'telegram.700' }}
                          my={5}
                          size="lg"
                          isLoading={isSubmitting}
                        >
                          Submit
                        </Button>
                      </Center>
                    </GridItem>
                  </SimpleGrid>
                </Box>
              </Flex>
            </Form>
          )
        }
      </Formik>
    </PageWrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
