// Import necessary React hooks: 
// - useState is for managing state (data that can change)
// - useEffect is for handling side effects (like fetching data)
import { useState, useEffect } from "react";

// Import UI components from AWS Amplify's UI library
// These are pre-built components that AWS provides for easy development
import {
  Authenticator,  // Handles user authentication (login/signup)
  Button,         // UI button component
  Text,           // Regular text component
  TextField,      // Input field component
  Heading,        // Header text component
  Flex,           // Flexible container for layout
  View,           // Basic container component
  Grid,           // Grid layout component
  Divider,        // Horizontal line separator
} from "@aws-amplify/ui-react";

// Import the main Amplify library for AWS configuration
import { Amplify } from "aws-amplify";

// Import CSS styles for Amplify UI components
import "@aws-amplify/ui-react/styles.css";

// Import function to create a client for interacting with AWS data
import { generateClient } from "aws-amplify/data";

// Import AWS configuration from a JSON file
import outputs from "../amplify_outputs.json";

// Configure Amplify with the settings from outputs file
Amplify.configure(outputs);

// Create a client for interacting with AWS, using user authentication
const client = generateClient({
  authMode: "userPool",
});

// Main App component
export default function App() {
  // Create state variable 'expenses' and function to update it 'setExpenses'
  // Initially, expenses is an empty array
  const [expenses, setExpenses] = useState([]);

  // useEffect hook runs when component mounts
  // Sets up real-time updates for expenses data
  useEffect(() => {
    client.models.Expense.observeQuery().subscribe({
      next: (data) => setExpenses([...data.items]),  // Update expenses when data changes
    });
  }, []);  // Empty array means this runs once when component mounts

  // Function to handle creating a new expense
  async function createExpense(event) {
    event.preventDefault();  // Prevent form from submitting normally
    const form = new FormData(event.target);  // Get form data

    // Create new expense in AWS database
    await client.models.Expense.create({
      name: form.get("name"),    // Get expense name from form
      amount: form.get("amount"), // Get expense amount from form
    });

    event.target.reset();  // Clear the form
  }

  // Function to delete an expense
  async function deleteExpense({ id }) {
    const toBeDeletedExpense = {
      id,
    };
    // Delete expense from AWS database
    await client.models.Expense.delete(toBeDeletedExpense);
  }

  // Render the component
  return (
    // Wrap everything in Authenticator to require login
    <Authenticator>
      {({ signOut }) => (  // Authenticator provides signOut function
        <Flex className="App" justifyContent="center" alignItems="center" direction="column" width="70%" margin="0 auto">
          {/* Main heading */}
          <Heading level={1}>Expense Tracker</Heading>

          {/* Form for creating new expenses */}
          <View as="form" margin="3rem 0" onSubmit={createExpense}>
            <Flex direction="column" justifyContent="center" gap="2rem" padding="2rem">
              {/* Input field for expense name */}
              <TextField
                name="name"
                placeholder="Expense Name"
                label="Expense Name"
                labelHidden
                variation="quiet"
                required
              />
              {/* Input field for expense amount */}
              <TextField
                name="amount"
                placeholder="Expense Amount"
                label="Expense Amount"
                type="float"
                labelHidden
                variation="quiet"
                required
              />
              {/* Submit button */}
              <Button type="submit" variation="primary">
                Create Expense
              </Button>
            </Flex>
          </View>

          <Divider />  {/* Horizontal line separator */}

          {/* Expenses section */}
          <Heading level={2}>Expenses</Heading>
          <Grid margin="3rem 0" autoFlow="column" justifyContent="center" gap="2rem" alignContent="center">
            {/* Map through expenses array and display each expense */}
            {expenses.map((expense) => (
              <Flex
                key={expense.id || expense.name}  // Unique key for React list rendering
                direction="column"
                justifyContent="center"
                alignItems="center"
                gap="2rem"
                border="1px solid #ccc"
                padding="2rem"
                borderRadius="5%"
                className="box"
              >
                <View>
                  <Heading level="3">{expense.name}</Heading>
                </View>
                <Text fontStyle="italic">${expense.amount}</Text>
                {/* Delete button for each expense */}
                <Button variation="destructive" onClick={() => deleteExpense(expense)}>
                  Delete note
                </Button>
              </Flex>
            ))}
          </Grid>
          {/* Sign out button */}
          <Button onClick={signOut}>Sign Out</Button>
        </Flex>
      )}
    </Authenticator>
  );
}