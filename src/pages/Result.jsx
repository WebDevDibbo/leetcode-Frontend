import React from 'react';

function Result(props) {
    return (
        <div>

                {activeRightBottom === "testcase" && (
                <div className="flex-1 p-4 overflow-y-auto">
                  <h3 className="font-semibold mb-4">Test Results</h3>
                  {runResult ? (
                    <div
                      className={`alert ${
                        runResult.success ? "alert-success" : "alert-error"
                      } mb-4`}
                    >
                      <div>
                        {runResult.success ? (
                          <div>
                            <h4 className="font-bold">
                              ✅ All test cases passed!
                            </h4>
                            <p className="text-sm mt-2">
                              Runtime: {runResult.runtime + " sec"}
                            </p>
                            <p className="text-sm">
                              Memory: {runResult.memory + " KB"}
                            </p>

                            <div className="mt-4 space-y-2">
                              {runResult.testCases.map((tc, i) => (
                                <div
                                  key={i}
                                  className="bg-base-100 p-3 rounded text-xs"
                                >
                                  <div className="font-mono">
                                    <div>
                                      <strong>Input:</strong> {tc.stdin}
                                    </div>
                                    <div>
                                      <strong>Expected:</strong>{" "}
                                      {tc.expected_output}
                                    </div>
                                    <div>
                                      <strong>Output:</strong> {tc.stdout}
                                    </div>
                                    <div className={"text-green-600"}>
                                      {"✔ Passed"}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-bold">❌ Error</h4>
                            <div className="mt-4 space-y-2">
                              {runResult.testCases.map((tc, i) => (
                                <div
                                  key={i}
                                  className="bg-base-100 p-3 rounded text-xs"
                                >
                                  <div className="font-mono">
                                    <div>
                                      <strong>Input:</strong> {tc.stdin}
                                    </div>
                                    <div>
                                      <strong>Expected:</strong>{" "}
                                      {tc.expected_output}
                                    </div>
                                    <div>
                                      <strong>Output:</strong> {tc.stdout}
                                    </div>
                                    <div
                                      className={
                                        tc.status_id == 3
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }
                                    >
                                      {tc.status_id == 3
                                        ? "✓ Passed"
                                        : "✗ Failed"}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      Click "Run" to test your code with the example test cases.
                    </div>
                  )}
                </div>
              )}

        </div>
    );
}

export default Result;