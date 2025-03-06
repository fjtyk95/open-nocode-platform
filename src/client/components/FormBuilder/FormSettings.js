import React from 'react';
import { 
  Box, 
  Typography, 
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const FormSettings = ({ settings, onUpdateSettings }) => {
  const { t } = useTranslation();
  
  const handleChange = (prop, value) => {
    onUpdateSettings({ [prop]: value });
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('formSettings')}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label={t('submitButtonText')}
          value={settings?.submitButtonText || ''}
          onChange={(e) => handleChange('submitButtonText', e.target.value)}
          margin="normal"
          variant="outlined"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings?.showResetButton || false}
              onChange={(e) => handleChange('showResetButton', e.target.checked)}
              color="primary"
            />
          }
          label={t('showResetButton')}
          sx={{ mt: 1, display: 'block' }}
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings?.enableAutosave || false}
              onChange={(e) => handleChange('enableAutosave', e.target.checked)}
              color="primary"
            />
          }
          label={t('enableAutosave')}
          sx={{ mt: 1, display: 'block' }}
        />
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" gutterBottom>
        {t('layoutSettings')}
      </Typography>
      
      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel id="form-layout-label">{t('formLayout')}</InputLabel>
        <Select
          labelId="form-layout-label"
          value={settings?.layout || 'standard'}
          onChange={(e) => handleChange('layout', e.target.value)}
          label={t('formLayout')}
        >
          <MenuItem value="standard">{t('layouts.standard')}</MenuItem>
          <MenuItem value="compact">{t('layouts.compact')}</MenuItem>
          <MenuItem value="card">{t('layouts.card')}</MenuItem>
          <MenuItem value="wizard">{t('layouts.wizard')}</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel id="label-position-label">{t('labelPosition')}</InputLabel>
        <Select
          labelId="label-position-label"
          value={settings?.labelPosition || 'top'}
          onChange={(e) => handleChange('labelPosition', e.target.value)}
          label={t('labelPosition')}
        >
          <MenuItem value="top">{t('labelPositions.top')}</MenuItem>
          <MenuItem value="left">{t('labelPositions.left')}</MenuItem>
          <MenuItem value="right">{t('labelPositions.right')}</MenuItem>
          <MenuItem value="float">{t('labelPositions.float')}</MenuItem>
        </Select>
      </FormControl>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" gutterBottom>
        {t('submissionSettings')}
      </Typography>
      
      <TextField
        fullWidth
        label={t('successMessage')}
        value={settings?.successMessage || ''}
        onChange={(e) => handleChange('successMessage', e.target.value)}
        margin="normal"
        variant="outlined"
        multiline
        rows={2}
      />
      
      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel id="after-submit-label">{t('afterSubmit')}</InputLabel>
        <Select
          labelId="after-submit-label"
          value={settings?.afterSubmit || 'message'}
          onChange={(e) => handleChange('afterSubmit', e.target.value)}
          label={t('afterSubmit')}
        >
          <MenuItem value="message">{t('afterSubmitActions.message')}</MenuItem>
          <MenuItem value="redirect">{t('afterSubmitActions.redirect')}</MenuItem>
          <MenuItem value="reset">{t('afterSubmitActions.reset')}</MenuItem>
        </Select>
      </FormControl>
      
      {settings?.afterSubmit === 'redirect' && (
        <TextField
          fullWidth
          label={t('redirectUrl')}
          value={settings?.redirectUrl || ''}
          onChange={(e) => handleChange('redirectUrl', e.target.value)}
          margin="normal"
          variant="outlined"
        />
      )}
      
      <FormControlLabel
        control={
          <Switch
            checked={settings?.storeSubmissions || true}
            onChange={(e) => handleChange('storeSubmissions', e.target.checked)}
            color="primary"
          />
        }
        label={t('storeSubmissions')}
        sx={{ mt: 1, display: 'block' }}
      />
      
      <FormControlLabel
        control={
          <Switch
            checked={settings?.sendEmailNotification || false}
            onChange={(e) => handleChange('sendEmailNotification', e.target.checked)}
            color="primary"
          />
        }
        label={t('sendEmailNotification')}
        sx={{ mt: 1, display: 'block' }}
      />
      
      {settings?.sendEmailNotification && (
        <TextField
          fullWidth
          label={t('notificationEmails')}
          value={settings?.notificationEmails || ''}
          onChange={(e) => handleChange('notificationEmails', e.target.value)}
          margin="normal"
          variant="outlined"
          placeholder="email1@example.com, email2@example.com"
          helperText={t('multipleEmailsHint')}
        />
      )}
    </Box>
  );
};

export default FormSettings; 