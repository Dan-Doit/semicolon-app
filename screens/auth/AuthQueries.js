import { gql } from 'apollo-boost';

export const LOG_IN = gql`
mutation requestSecret($email: String!){
    requestSecret(email:$email)
}
`;
export const CREATE_ACCOUNT = gql`
  mutation createAccount(
    $username: String!
    $email: String!
    $firstName: String
    $lastName: String
    $password: String!
  ) {
    createAccount(
      password: $password
      username: $username
      email: $email
      firstName: $firstName
      lastName: $lastName
    )
  }
`;

export const CONFIRM_SECRET = gql`
  mutation confirmSecret($email : String! , $secret : String!
  ){
    confirmSecret (email : $email
    secret:$secret
    )
  } 
`;

export const CONFIRM_USER = gql`
mutation confirmUser($email:String!, $password : String!){
  confirmUser(email:$email password: $password)
}

`

export const CHECK_EMAIL = gql`
mutation checkemail($email:String!){
  checkemail(email:$email)
}
`

export const FIND_PW = gql`
mutation findrequestSecret($email:String!){
  findrequestSecret(email:$email)
}`

export const UPDATE_PW = gql`
mutation updatePw($email:String! $password:String!){
  updatePw(email:$email, password:$password){
    id
  }
}`