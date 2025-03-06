import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDrag } from 'react-dnd';

// アイコンのインポート
import TextFieldsIcon from '@mui/icons-material/TextFields';
import NumbersIcon from '@mui/icons-material/Numbers';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SubjectIcon from '@mui/icons-material/Subject';
import GridOnIcon from '@mui/icons-material/GridOn';
import ExtensionIcon from '@mui/icons-material/Extension';

// フィールドタイプとアイコンのマッピング
const fieldTypeIcons = {
  text: TextFieldsIcon,
  number: NumbersIcon,
  date: CalendarTodayIcon,
  checkbox: CheckBoxIcon,
  radio: RadioButtonCheckedIcon,
  select: ArrowDropDownCircleIcon,
  email: EmailIcon,
  phone: PhoneIcon,
  file: AttachFileIcon,
  textarea: SubjectIcon,
  table: GridOnIcon
};

// ドラッグ可能なフィールドアイテム
const DraggableFieldItem = ({ type, label, onAddField }) => {
  const { t } = useTranslation();
  const IconComponent = fieldTypeIcons[type] || ExtensionIcon;
  
  const [{ isDragging }, drag] = useDrag({
    type: 'FIELD',
    item: { type },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onAddField(type);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  return (
    <ListItem 
      button 
      ref={drag}
      onClick={() => onAddField(type)}
      sx={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        }
      }}
    >
      <ListItemIcon>
        <IconComponent />
      </ListItemIcon>
      <ListItemText primary={label || t(`fieldTypes.${type}.label`)} />
    </ListItem>
  );
};

// フィールドパレットコンポーネント
const FieldPalette = ({ onAddField, customFieldTypes = [] }) => {
  const { t } = useTranslation();
  
  // 標準フィールドタイプ
  const standardFieldTypes = [
    'text',
    'number',
    'date',
    'checkbox',
    'radio',
    'select',
    'email',
    'phone',
    'textarea',
    'file'
  ];
  
  // 高度なフィールドタイプ
  const advancedFieldTypes = [
    'table',
    'signature',
    'rating',
    'address'
  ];
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('fieldPalette')}
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        {t('dragFieldsHint')}
      </Typography>
      
      <Paper variant="outlined" sx={{ maxHeight: 500, overflow: 'auto' }}>
        <List dense component="div">
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
            {t('standardFields')}
          </Typography>
          
          {standardFieldTypes.map(type => (
            <DraggableFieldItem 
              key={type}
              type={type}
              onAddField={onAddField}
            />
          ))}
          
          <Divider sx={{ my: 1 }} />
          
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
            {t('advancedFields')}
          </Typography>
          
          {advancedFieldTypes.map(type => (
            <DraggableFieldItem 
              key={type}
              type={type}
              onAddField={onAddField}
            />
          ))}
          
          {customFieldTypes.length > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
                {t('customFields')}
              </Typography>
              
              {customFieldTypes.map(field => (
                <DraggableFieldItem 
                  key={field.type}
                  type={field.type}
                  label={field.label}
                  onAddField={onAddField}
                />
              ))}
            </>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default FieldPalette; 