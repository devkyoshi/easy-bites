package com.ds.communicationservice;

import java.util.Map;

/**
 * Interface for communication services that handle email sending via SendGrid.
 */
public interface CommunicationService {

    /**
     * Sends a simple email with text content.
     *
     * @param to      recipient email address
     * @param subject email subject
     * @param content email content (text)
     * @return true if the email was sent successfully, false otherwise
     */
    boolean sendEmail(String to, String subject, String content);

    /**
     * Sends a simple email with text content and attachments.
     *
     * @param to          recipient email address
     * @param subject     email subject
     * @param content     email content (text)
     * @param attachments map of filename to base64 encoded content
     * @return true if the email was sent successfully, false otherwise
     */
    boolean sendEmailWithAttachments(String to, String subject, String content, Map<String, String> attachments);

    /**
     * Sends an email with HTML content.
     *
     * @param to          recipient email address
     * @param subject     email subject
     * @param htmlContent email content (HTML)
     * @return true if the email was sent successfully, false otherwise
     */
    boolean sendHtmlEmail(String to, String subject, String htmlContent);

    /**
     * Sends an email with HTML content and attachments.
     *
     * @param to          recipient email address
     * @param subject     email subject
     * @param htmlContent email content (HTML)
     * @param attachments map of filename to base64 encoded content
     * @return true if the email was sent successfully, false otherwise
     */
    boolean sendHtmlEmailWithAttachments(String to, String subject, String htmlContent, Map<String, String> attachments);

    /**
     * Sends an email to multiple recipients.
     *
     * @param toAddresses array of recipient email addresses
     * @param subject     email subject
     * @param content     email content
     * @param isHtml      true if content is HTML, false if plain text
     * @return true if the email was sent successfully, false otherwise
     */
    boolean sendBulkEmail(String[] toAddresses, String subject, String content, boolean isHtml);

    /**
     * Sends an email to multiple recipients with attachments.
     *
     * @param toAddresses array of recipient email addresses
     * @param subject     email subject
     * @param content     email content
     * @param isHtml      true if content is HTML, false if plain text
     * @param attachments map of filename to base64 encoded content
     * @return true if the email was sent successfully, false otherwise
     */
    boolean sendBulkEmailWithAttachments(String[] toAddresses, String subject, String content, boolean isHtml, Map<String, String> attachments);

    /**
     * Sends an email using a SendGrid template.
     *
     * @param to           recipient email address
     * @param subject      email subject
     * @param templateId   SendGrid template ID
     * @param templateData data to be used in the template
     * @return true if the email was sent successfully, false otherwise
     */
    boolean sendTemplateEmail(String to, String subject, String templateId, Map<String, String> templateData);

    /**
     * Sends an email using a SendGrid template with attachments.
     *
     * @param to           recipient email address
     * @param subject      email subject
     * @param templateId   SendGrid template ID
     * @param templateData data to be used in the template
     * @param attachments  map of filename to base64 encoded content
     * @return true if the email was sent successfully, false otherwise
     */
    boolean sendTemplateEmailWithAttachments(String to, String subject, String templateId, Map<String, String> templateData, Map<String, String> attachments);
}
