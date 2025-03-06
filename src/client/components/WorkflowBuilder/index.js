import React, { useState, useEffect } from 'react';
import ReactFlow, { 
  Controls, 
  Background,
  addEdge,
  removeElements
} from 'react-flow-renderer';
import { 
  Box, 
  Paper, 
  Typography, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@material-ui/core';
import { 
  saveWorkflow, 
  getWorkflowByFormId 
} from '../../services/workflowService';

const WorkflowBuilder = ({ formId }) => {
  const [elements, setElements] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    if (formId) {
      getWorkflowByFormId(formId).then(workflow => {
        if (workflow && workflow.steps) {
          // ワークフローステップをReactFlowの要素に変換
          const flowElements = convertWorkflowToElements(workflow.steps);
          setElements(flowElements);
        } else {
          // 新規ワークフローの場合は開始ノードを作成
          setElements([
            {
              id: 'start',
              type: 'input',
              data: { label: '開始' },
              position: { x: 250, y: 5 }
            }
          ]);
        }
      });
    }
  }, [formId]);

  const onConnect = (params) => {
    setElements(els => addEdge(params, els));
  };

  const onElementsRemove = (elementsToRemove) => {
    setElements(els => removeElements(elementsToRemove, els));
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setIsDialogOpen(true);
  };

  const handleAddStep = () => {
    // 新規ステップ追加処理
    // ...
  };

  const handleSaveWorkflow = async () => {
    // ワークフロー保存処理
    // ...
  };

  return (
    <Box p={2} height="80vh">
      <Typography variant="h5">ワークフロー設定</Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddStep}
          style={{ marginRight: 8 }}
        >
          ステップ追加
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleSaveWorkflow}
        >
          保存
        </Button>
      </Box>
      
      <Paper style={{ height: '100%' }}>
        <ReactFlow
          elements={elements}
          onConnect={onConnect}
          onElementsRemove={onElementsRemove}
          onNodeClick={onNodeClick}
          deleteKeyCode={46}
        >
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </Paper>
      
      {/* ステップ設定ダイアログ */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>ステップ設定</DialogTitle>
        <DialogContent>
          {selectedNode && (
            <Box width={400}>
              <TextField
                fullWidth
                label="ステップ名"
                value={selectedNode.data.label}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>承認者ロール</InputLabel>
                <Select>
                  <MenuItem value="manager">上席</MenuItem>
                  <MenuItem value="admin">管理部</MenuItem>
                  <MenuItem value="director">部長</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>アクション</InputLabel>
                <Select>
                  <MenuItem value="approve">承認</MenuItem>
                  <MenuItem value="reject">差戻し</MenuItem>
                  <MenuItem value="auto">自動処理</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>キャンセル</Button>
          <Button color="primary">保存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowBuilder; 