import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // This lifecycle method is triggered when an error is thrown in a child component
  static getDerivedStateFromError(error) {
    // Update the state to indicate an error occurred
    return { hasError: true };
  }

  // This lifecycle method will catch the error and log it
  componentDidCatch(error, info) {
    // You can log the error and error info here, e.g., sending it to an external service
    console.log("Error caught by Error Boundary:", error);
    console.log("Error info:", info);
    this.setState({ error, errorInfo: info });
  }

  render() {
    if (this.state.hasError) {
      // You can render a fallback UI
      return (
        <div>
          <h1>Something went wrong!</h1>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    // If there's no error, render the children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
