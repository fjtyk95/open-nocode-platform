import React from 'react';
import { 
  Box, 
  Typography, 
  TextField,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// フィールドタイプごとのプレビューコンポーネント
const FormFieldPreview = ({ field }) => {
  const { t } = useTranslation();
  
  if (!field) return null;
  
  // 必須マーク
  const requiredMark = field.required ? (
    <Typography component="span" color="error" sx={{ ml: 0.5 }}>*</Typography>
  ) : null;
  
  // ヘルプテキスト
  const helpText = field.helpText ? (
    <FormHelperText>{field.helpText}</FormHelperText>
  ) : null;
  
  // フィールドタイプに応じたコンポーネントをレンダリング
  switch (field.type) {
    case 'text':
      return (
        <Box>
          <TextField
            fullWidth
            label={
              <Box component="span">
                {field.label}
                {requiredMark}
              </Box>
            }
            placeholder={field.placeholder}
            disabled
            variant="outlined"
          />
          {helpText}
        </Box>
      );
      
    case 'textarea':
      return (
        <Box>
          <TextField
            fullWidth
            label={
              <Box component="span">
                {field.label}
                {requiredMark}
              </Box>
            }
            placeholder={field.placeholder}
            multiline
            rows={3}
            disabled
            variant="outlined"
          />
          {helpText}
        </Box>
      );
      
    case 'number':
      return (
        <Box>
          <TextField
            fullWidth
            label={
              <Box component="span">
                {field.label}
                {requiredMark}
              </Box>
            }
            type="number"
            placeholder={field.placeholder}
            disabled
            variant="outlined"
          />
          {helpText}
        </Box>
      );
      
    case 'date':
      return (
        <Box>
          <TextField
            fullWidth
            label={
              <Box component="span">
                {field.label}
                {requiredMark}
              </Box>
            }
            type="date"
            InputLabelProps={{ shrink: true }}
            disabled
            variant="outlined"
          />
          {helpText}
        </Box>
      );
      
    case 'checkbox':
      return (
        <Box>
          <Typography variant="body1" gutterBottom>
            {field.label}
            {requiredMark}
          </Typography>
          {field.options?.map((option, index) => (
            <FormControlLabel
              key={index}
              control={<Checkbox disabled />}
              label={option.label}
            />
          ))}
          {helpText}
        </Box>
      );
      
    case 'radio':
      return (
        <Box>
          <Typography variant="body1" gutterBottom>
            {field.label}
            {requiredMark}
          </Typography>
          <RadioGroup>
            {field.options?.map((option, index) => (
              <FormControlLabel
                key={index}
                control={<Radio disabled />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          {helpText}
        </Box>
      );
      
    case 'select':
      return (
        <Box>
          <FormControl fullWidth variant="outlined" disabled>
            <InputLabel>
              {field.label}
              {field.required && '*'}
            </InputLabel>
            <Select
              label={`${field.label}${field.required ? '*' : ''}`}
              value=""
            >
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {helpText}
        </Box>
      );
      
    case 'email':
      return (
        <Box>
          <TextField
            fullWidth
            label={
              <Box component="span">
                {field.label}
                {requiredMark}
              </Box>
            }
            type="email"
            placeholder={field.placeholder}
            disabled
            variant="outlined"
          />
          {helpText}
        </Box>
      );
      
    case 'file':
      return (
        <Box>
          <Typography variant="body1" gutterBottom>
            {field.label}
            {requiredMark}
          </Typography>
          <Box
            sx={{
              border: '1px dashed grey',
              borderRadius: 1,
              p: 2,
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }}
          >
            <Typography variant="body2" color="textSecondary">
              {t('dropFilesHere')}
            </Typography>
          </Box>
          {helpText}
        </Box>
      );
      
    default:
      return (
        <Box>
          <Typography variant="body1">
            {field.label} ({field.type})
            {requiredMark}
          </Typography>
          {helpText}
        </Box>
      );
  }
};

export default FormFieldPreview; 