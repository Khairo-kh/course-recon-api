import { Flex, Box, SimpleGrid, GridItem, Center, Button, Text } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import Link from 'next/link';
import router from 'next/router';
import { InputField } from '../../components/InputField';
import PageWrapper from '../../components/PageWrapper';
import { toErrorMap } from '../../utils/toErrorMap';
import login from '../login';

const ResetPassword: NextPage<{ token: string }> = ({ token }) => {
  return (
    <PageWrapper variant="small">
      <Formik
        initialValues={{newPassword: ''}}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            router.push('/');
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
                <SimpleGrid columns={2} columnGap={2} spacing={4}>
                
                  <GridItem colSpan={2}>
                    <InputField
                      name="newPassword"
                      label="New Password"
                      type="password"
                      placeholder="plz make me strong ... 🥺"
                    />
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Center>
                      <Button
                        type="submit"
                        variant="solid"
                        color="white"
                        bg="telegram.600"
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

export default ResetPassword;
