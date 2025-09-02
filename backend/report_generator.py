#!/usr/bin/env python3
"""
PDF Report Generator for Stroke Prediction Results
Creates beautiful, user-friendly reports instead of raw JSON
"""

import os
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import json

class StrokeReportGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        """Setup custom paragraph styles for the report"""
        # Title style
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.darkblue
        )
        
        # Subtitle style
        self.subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=self.styles['Heading2'],
            fontSize=18,
            spaceAfter=20,
            alignment=TA_CENTER,
            textColor=colors.darkgreen
        )
        
        # Section style
        self.section_style = ParagraphStyle(
            'CustomSection',
            parent=self.styles['Heading3'],
            fontSize=16,
            spaceAfter=15,
            spaceBefore=20,
            textColor=colors.darkred
        )
        
        # Normal text style
        self.normal_style = ParagraphStyle(
            'CustomNormal',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=12,
            alignment=TA_LEFT
        )
        
        # Risk level style
        self.risk_style = ParagraphStyle(
            'CustomRisk',
            parent=self.styles['Normal'],
            fontSize=14,
            spaceAfter=15,
            alignment=TA_CENTER,
            textColor=colors.white,
            backColor=colors.darkred,
            borderWidth=1,
            borderColor=colors.black,
            borderPadding=10
        )
    
    def generate_report(self, prediction_data, output_path):
        """Generate a beautiful PDF report"""
        try:
            # Create PDF document
            doc = SimpleDocTemplate(output_path, pagesize=A4)
            story = []
            
            # Add header
            story.extend(self.create_header(prediction_data))
            
            # Add risk assessment
            story.extend(self.create_risk_assessment(prediction_data))
            
            # Add recommendations
            story.extend(self.create_recommendations(prediction_data))
            
            # Add health tips
            story.extend(self.create_health_tips())
            
            # Add footer
            story.extend(self.create_footer(prediction_data))
            
            # Build PDF
            doc.build(story)
            return True
            
        except Exception as e:
            print(f"❌ Error generating report: {e}")
            return False
    
    def create_header(self, data):
        """Create report header"""
        elements = []
        
        # Title
        title = Paragraph("🏥 STROKE RISK ASSESSMENT REPORT", self.title_style)
        elements.append(title)
        elements.append(Spacer(1, 20))
        
        # Date and time
        date_str = datetime.now().strftime("%B %d, %Y at %I:%M %p")
        date_para = Paragraph(f"Generated on: {date_str}", self.normal_style)
        elements.append(date_para)
        elements.append(Spacer(1, 30))
        
        return elements
    
    def create_risk_assessment(self, data):
        """Create risk assessment section"""
        elements = []
        
        # Section title
        section_title = Paragraph("📊 RISK ASSESSMENT RESULTS", self.subtitle_style)
        elements.append(section_title)
        elements.append(Spacer(1, 20))
        
        # Risk level with color coding
        risk_level = data.get('risk_level', 'unknown').upper()
        stroke_prob = data.get('stroke_probability', 0)
        
        # Color code based on risk level
        if risk_level == 'HIGH':
            risk_color = colors.darkred
        elif risk_level == 'MODERATE':
            risk_color = colors.orange
        else:
            risk_color = colors.darkgreen
        
        # Update risk style with dynamic color
        self.risk_style.backColor = risk_color
        
        risk_para = Paragraph(
            f"Your Stroke Risk Level: {risk_level}<br/>"
            f"Probability: {stroke_prob:.1f}%",
            self.risk_style
        )
        elements.append(risk_para)
        elements.append(Spacer(1, 20))
        
        # Risk interpretation
        if risk_level == 'HIGH':
            interpretation = (
                "⚠️ <b>High Risk:</b> You have an elevated risk of stroke. "
                "Immediate consultation with a healthcare provider is strongly recommended. "
                "Focus on implementing all preventive measures listed in this report."
            )
        elif risk_level == 'MODERATE':
            interpretation = (
                "⚠️ <b>Moderate Risk:</b> You have a moderate risk of stroke. "
                "While not immediately concerning, implementing preventive measures "
                "can significantly reduce your risk."
            )
        else:
            interpretation = (
                "✅ <b>Low Risk:</b> Your current risk of stroke is low. "
                "Continue maintaining a healthy lifestyle and consider the preventive "
                "measures in this report to keep your risk low."
            )
        
        interpretation_para = Paragraph(interpretation, self.normal_style)
        elements.append(interpretation_para)
        elements.append(Spacer(1, 30))
        
        return elements
    
    def create_recommendations(self, data):
        """Create recommendations section"""
        elements = []
        
        # Section title
        section_title = Paragraph("💡 PERSONALIZED RECOMMENDATIONS", self.subtitle_style)
        elements.append(section_title)
        elements.append(Spacer(1, 20))
        
        recommendations = data.get('recommendations', {})
        
        # Lifestyle recommendations
        if recommendations.get('lifestyle'):
            elements.append(Paragraph("<b>🏃‍♂️ Lifestyle Changes:</b>", self.section_style))
            for rec in recommendations['lifestyle']:
                rec_para = Paragraph(f"• {rec}", self.normal_style)
                elements.append(rec_para)
            elements.append(Spacer(1, 15))
        
        # Diet recommendations
        if recommendations.get('diet'):
            elements.append(Paragraph("<b>🥗 Dietary Recommendations:</b>", self.section_style))
            for rec in recommendations['diet']:
                rec_para = Paragraph(f"• {rec}", self.normal_style)
                elements.append(rec_para)
            elements.append(Spacer(1, 15))
        
        # Medical recommendations
        if recommendations.get('medical'):
            elements.append(Paragraph("<b>🏥 Medical Monitoring:</b>", self.section_style))
            for rec in recommendations['medical']:
                rec_para = Paragraph(f"• {rec}", self.normal_style)
                elements.append(rec_para)
            elements.append(Spacer(1, 15))
        
        # Monitoring recommendations
        if recommendations.get('monitoring'):
            elements.append(Paragraph("<b>📊 Health Monitoring:</b>", self.section_style))
            for rec in recommendations['monitoring']:
                rec_para = Paragraph(f"• {rec}", self.normal_style)
                elements.append(rec_para)
            elements.append(Spacer(1, 20))
        
        return elements
    
    def create_health_tips(self):
        """Create general health tips section"""
        elements = []
        
        # Section title
        section_title = Paragraph("🌿 GENERAL HEALTH TIPS", self.subtitle_style)
        elements.append(section_title)
        elements.append(Spacer(1, 20))
        
        tips = [
            "Maintain a healthy blood pressure (below 120/80 mmHg)",
            "Keep blood sugar levels under control if you have diabetes",
            "Maintain a healthy weight with BMI between 18.5-24.9",
            "Exercise regularly (at least 150 minutes of moderate activity weekly)",
            "Eat a balanced diet rich in fruits, vegetables, and whole grains",
            "Limit salt intake to less than 2,300mg daily",
            "Avoid smoking and limit alcohol consumption",
            "Get 7-9 hours of quality sleep each night",
            "Manage stress through relaxation techniques",
            "Schedule regular health check-ups with your doctor"
        ]
        
        for tip in tips:
            tip_para = Paragraph(f"• {tip}", self.normal_style)
            elements.append(tip_para)
        
        elements.append(Spacer(1, 30))
        return elements
    
    def create_footer(self, data):
        """Create report footer"""
        elements = []
        
        # Disclaimer
        disclaimer = (
            "<b>⚠️ IMPORTANT DISCLAIMER:</b><br/>"
            "This report is for informational purposes only and should not replace "
            "professional medical advice. Always consult with a qualified healthcare "
            "provider for proper diagnosis and treatment. The predictions and "
            "recommendations are based on machine learning algorithms and may not "
            "be 100% accurate for all individuals."
        )
        
        disclaimer_para = Paragraph(disclaimer, self.normal_style)
        elements.append(disclaimer_para)
        elements.append(Spacer(1, 20))
        
        # Contact info
        contact = (
            "<b>📞 Emergency:</b> If you experience stroke symptoms (FAST: Face drooping, "
            "Arm weakness, Speech difficulty, Time to call emergency), call emergency "
            "services immediately."
        )
        
        contact_para = Paragraph(contact, self.normal_style)
        elements.append(contact_para)
        elements.append(Spacer(1, 20))
        
        # Generated by
        generated_by = f"Report generated by Stroke Prediction AI System on {datetime.now().strftime('%B %d, %Y')}"
        generated_para = Paragraph(generated_by, self.normal_style)
        elements.append(generated_para)
        
        return elements

def generate_stroke_report(prediction_data, output_dir="reports"):
    """Generate a stroke prediction report"""
    try:
        # Create reports directory if it doesn't exist
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        # Generate filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"stroke_report_{timestamp}.pdf"
        output_path = os.path.join(output_dir, filename)
        
        # Generate report
        generator = StrokeReportGenerator()
        success = generator.generate_report(prediction_data, output_path)
        
        if success:
            return {
                'success': True,
                'file_path': output_path,
                'filename': filename,
                'message': 'Report generated successfully'
            }
        else:
            return {
                'success': False,
                'error': 'Failed to generate report'
            }
            
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }
