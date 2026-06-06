import { Component } from "react";

/**
 * Fängt unerwartete Render-Fehler in der Komponenten-Hierarchie ab und zeigt
 * eine freundliche Ersatzanzeige, statt die ganze App abstürzen zu lassen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In einer echten App würde hier ein Monitoring-Dienst benachrichtigt.
    console.error("Unerwarteter Fehler:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, color: "#eaeaea" }}>
          <h2>Etwas ist schiefgelaufen.</h2>
          <p>Bitte lade die Seite neu. Falls der Fehler bleibt, melde dich erneut an.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
