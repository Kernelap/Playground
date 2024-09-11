import React, { useCallback, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { Button } from "./components/ui/button";
import { ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import CustomTableNode from "./components/custom-table-node";

const initialNodes = [
  { id: "1", position: { x: 50, y: 200 }, data: { label: "table_1" } },
  { id: "2", position: { x: 50, y: 400 }, data: { label: "table_2" } },
];
const initialEdges = [
  {
    id: "testing",
    source: "1",
    target: "2",

    style: {
      color: "red",
      backgroundColor: "red",
    },
    animated: true,
  },
];

export default function App() {
  const nodeTypes = useMemo(() => ({ table: CustomTableNode }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleAddNode = ({ label }: { label?: string }) => {
    setNodes((prev) => {
      return [
        ...prev,
        {
          id: ((prev.length || 0) + 1).toString(),
          position: { x: 0, y: 100 },
          data: {
            label: label || `table_${(prev.length || 0) + 1}`,
            columns: [{ name: "id", type: "Bigint" }],
          },
          type: "table",
        },
      ];
    });
  };

  return (
    <div className="flex ">
      <div className="w-[20%] h-screen bg-primary/5 px-3 py-5">
        <h1 className="text-xl font-bold">Query Builder</h1>

        <Button onClick={handleAddNode.bind(null, {})} className="w-full mt-4">
          <Plus className="size-4 mr-2" />
          New Table
        </Button>
        <div className="flex flex-col gap-y-2 mt-6">
          {nodes.map((el) => (
            <div
              key={el.id}
              className="flex justify-between items-center bg-neutral-50 p-3 rounded-md"
            >
              <div className="flex items-center gap-1">
                <ChevronDown
                  role="button"
                  className="text-muted-foreground size-4"
                />

                <h3 className="text-sm font-bold">{el.data.label}</h3>
              </div>
              <div className="flex items-center gap-x-2">
                <MoreHorizontal
                  role="button"
                  className="text-muted-foreground size-4"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[calc(100%-20%)] h-screen">
        <ReactFlow
          selectionOnDrag
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onPaneScroll={(e) => {
            console.log(e);
          }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
