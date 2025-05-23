declare module 'python-bridge' {
  interface PythonBridge {
    ex: (code: string) => Promise<any>;
    end: () => Promise<void>;
  }
  function pythonBridge(options?: any): PythonBridge;
  export default pythonBridge;
}
