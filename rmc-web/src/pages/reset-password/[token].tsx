import {
  Flex,
  Box,
  SimpleGrid,
  GridItem,
  Center,
  Button,
  FormControl,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import router, { useRouter } from 'next/router';
import { useState } from 'react';
import { InputField } from '../../components/InputField';
import PageWrapper from '../../components/PageWrapper';
import { useResetPasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import login from '../login';

const ResetPassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [, changePassword] = useResetPasswordMutation();
  const [tokenError, setTokenError] = useState('');
  return (
    <PageWrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token,
          });

          if (response.data?.resetPassword.errors) {
            const errorMap = toErrorMap(response.data.resetPassword.errors);
            'token' in errorMap ? setTokenError(errorMap.token) : null;
            setErrors(errorMap);
          } else if (response.data?.resetPassword.user) {
            router.push('/login');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex
              justifyContent="center"
              alignItems="center"
              minH="80vh"
              h="100%"
            >
              <Box bg="white" p={5} borderRadius={10}>
                <SimpleGrid columns={2} columnGap={2} spacing={5}>
                  <GridItem colSpan={2}>
                    <FormControl isInvalid={tokenError !== ''}>
                      <InputField
                        name="newPassword"
                        label="New Password"
                        type="password"
                        placeholder="plz make me strong 🥺"
                        _size="lg"
                      />
                      {tokenError === '' ? (
                        <FormHelperText>
                          Enter your new password.
                        </FormHelperText>
                      ) : (
                        <FormErrorMessage>{tokenError}</FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Center>
                      <Button
                        type="submit"
                        variant="solid"
                        color="white"
                        bg="telegram.600"
                        size="lg"
                        _hover={{ bg: 'telegram.700' }}
                        my={5}
                        isLoading={isSubmitting}
                      >
                        Change Password
                      </Button>
                    </Center>
                  </GridItem>
                </SimpleGrid>
              </Box>
            </Flex>
          </Form>
        )}
      </Formik>
    </PageWrapper>
  );
};

ResetPassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(ResetPassword);
