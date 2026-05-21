import { Component, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  AuthRefreshError,
  getCurrentRedirectPath,
  getLoginPathWithRedirect,
} from "../../services/api";

type RouteErrorBoundaryProps = {
  children: ReactNode;
};

type RouteErrorBoundaryState = {
  hasError: boolean;
  isAuthError: boolean;
};

class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  state: RouteErrorBoundaryState = { hasError: false, isAuthError: false };

  static getDerivedStateFromError(error: unknown): RouteErrorBoundaryState {
    if (error instanceof AuthRefreshError) {
      return { hasError: true, isAuthError: true };
    }

    return { hasError: true, isAuthError: false };
  }

  componentDidCatch() {
    // no-op: fallback navigation is handled by render
  }

  render() {
    if (this.state.isAuthError) {
      return (
        <Navigate
          to={getLoginPathWithRedirect(getCurrentRedirectPath())}
          replace
        />
      );
    }

    if (this.state.hasError) {
      return <Navigate to="/error" replace />;
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
