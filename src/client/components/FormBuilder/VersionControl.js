import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { 
  getFormVersions, 
  createNewVersion, 
  publishVersion 
} from '../../services/versionService';

const VersionControl = ({ formId }) => {
  const { t } = useTranslation();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [publishNote, setPublishNote] = useState('');
  
  // バージョン一覧の取得
  const loadVersions = async () => {
    if (!formId) return;
    
    setLoading(true);
    try {
      const data = await getFormVersions(formId);
      setVersions(data);
    } catch (error) {
      console.error('バージョン取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadVersions();
  }, [formId]);
  
  // 新しいバージョンの作成
  const handleCreateNewVersion = async () => {
    setLoading(true);
    try {
      await createNewVersion(formId);
      await loadVersions();
    } catch (error) {
      console.error('新バージョン作成エラー:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // バージョンの公開
  const handlePublishVersion = async () => {
    if (!selectedVersion) return;
    
    setLoading(true);
    try {
      await publishVersion(formId, selectedVersion.version, publishNote);
      setPublishDialogOpen(false);
      setPublishNote('');
      await loadVersions();
    } catch (error) {
      console.error('バージョン公開エラー:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 公開ダイアログを開く
  const openPublishDialog = (version) => {
    setSelectedVersion(version);
    setPublishDialogOpen(true);
  };
  
  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {t('versionControl')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateNewVersion}
            disabled={loading}
          >
            {t('createNewVersion')}
          </Button>
        </Box>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('version')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell>{t('createdBy')}</TableCell>
                <TableCell>{t('createdAt')}</TableCell>
                <TableCell>{t('publishedAt')}</TableCell>
                <TableCell>{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {versions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {loading ? t('loading') : t('noVersionsYet')}
                  </TableCell>
                </TableRow>
              ) : (
                versions.map((version) => (
                  <TableRow key={version.version}>
                    <TableCell>v{version.version}</TableCell>
                    <TableCell>
                      <Chip 
                        label={version.is_published ? t('published') : t('draft')}
                        color={version.is_published ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{version.created_by_name}</TableCell>
                    <TableCell>
                      {new Date(version.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {version.published_at 
                        ? new Date(version.published_at).toLocaleString() 
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {!version.is_published && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openPublishDialog(version)}
                          disabled={loading}
                        >
                          {t('publish')}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* 公開ダイアログ */}
      <Dialog
        open={publishDialogOpen}
        onClose={() => setPublishDialogOpen(false)}
      >
        <DialogTitle>{t('publishVersion')}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            {t('publishVersionConfirmation', { version: selectedVersion?.version })}
          </Typography>
          <TextField
            fullWidth
            label={t('publishNote')}
            value={publishNote}
            onChange={(e) => setPublishNote(e.target.value)}
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialogOpen(false)}>
            {t('cancel')}
          </Button>
          <Button 
            color="primary" 
            onClick={handlePublishVersion}
            disabled={loading}
          >
            {t('publish')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VersionControl; 