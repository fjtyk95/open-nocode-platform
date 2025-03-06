import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@material-ui/core';
import { 
  getFormVersions,
  publishVersion,
  createNewVersion
} from '../../services/versionService';

const VersionManagement = ({ formId }) => {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [publishNote, setPublishNote] = useState('');
  
  useEffect(() => {
    if (formId) {
      loadVersions();
    }
  }, [formId]);

  const loadVersions = () => {
    getFormVersions(formId).then(data => {
      setVersions(data);
    });
  };

  const handleCreateNewVersion = async () => {
    try {
      await createNewVersion(formId);
      loadVersions();
    } catch (error) {
      console.error('新バージョン作成エラー:', error);
    }
  };

  const handlePublishClick = (version) => {
    setSelectedVersion(version);
    setIsPublishDialogOpen(true);
  };

  const handlePublishVersion = async () => {
    try {
      await publishVersion(formId, selectedVersion.version, publishNote);
      setIsPublishDialogOpen(false);
      loadVersions();
    } catch (error) {
      console.error('バージョン公開エラー:', error);
    }
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">バージョン管理</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleCreateNewVersion}
        >
          新バージョン作成
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>バージョン</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>作成者</TableCell>
              <TableCell>作成日時</TableCell>
              <TableCell>公開日時</TableCell>
              <TableCell>アクション</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versions.map((version) => (
              <TableRow key={version.version}>
                <TableCell>{version.version}</TableCell>
                <TableCell>
                  {version.is_published ? '公開中' : 'ドラフト'}
                </TableCell>
                <TableCell>{version.created_by}</TableCell>
                <TableCell>{new Date(version.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  {version.published_at ? new Date(version.published_at).toLocaleString() : '-'}
                </TableCell>
                <TableCell>
                  {!version.is_published && (
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => handlePublishClick(version)}
                    >
                      公開
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* 公開ダイアログ */}
      <Dialog open={isPublishDialogOpen} onClose={() => setIsPublishDialogOpen(false)}>
        <DialogTitle>バージョン公開</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            バージョン {selectedVersion?.version} を公開します。
          </Typography>
          <TextField
            fullWidth
            label="公開メモ"
            multiline
            rows={4}
            value={publishNote}
            onChange={(e) => setPublishNote(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPublishDialogOpen(false)}>キャンセル</Button>
          <Button color="primary" onClick={handlePublishVersion}>公開</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VersionManagement; 