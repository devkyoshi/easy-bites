package com.ds.communicationservice;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Attachments;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Map;
import java.util.Base64;

/**
 * Implementation of the CommunicationService interface using SendGrid.
 */
@Service
@Slf4j
public class CommunicationServiceImpl implements CommunicationService {

    private final SendGrid sendGrid;
    private final String fromEmail;
    private final String fromName;

    public CommunicationServiceImpl(
            @Value("${sendgrid.api.key}") String apiKey,
            @Value("${sendgrid.from.email}") String fromEmail,
            @Value("${sendgrid.from.name}") String fromName) {
        this.sendGrid = new SendGrid(apiKey);
        this.fromEmail = fromEmail;
        this.fromName = fromName;
    }

    @Override
    public boolean sendEmail(String to, String subject, String content) {
        return sendEmailInternal(to, subject, new Content("text/plain", content));
    }

    @Override
    public boolean sendEmailWithAttachments(String to, String subject, String content, Map<String, String> attachments) {
        return sendEmailInternalWithAttachments(to, subject, new Content("text/plain", content), attachments);
    }

    @Override
    public boolean sendHtmlEmail(String to, String subject, String htmlContent) {
        return sendEmailInternal(to, subject, new Content("text/html", htmlContent));
    }

    @Override
    public boolean sendHtmlEmailWithAttachments(String to, String subject, String htmlContent, Map<String, String> attachments) {
        return sendEmailInternalWithAttachments(to, subject, new Content("text/html", htmlContent), attachments);
    }

    @Override
    public boolean sendBulkEmail(String[] toAddresses, String subject, String content, boolean isHtml) {
        try {
            Mail mail = new Mail();
            Email from = new Email(fromEmail, fromName);
            mail.setFrom(from);
            mail.setSubject(subject);

            Content emailContent = new Content(
                isHtml ? "text/html" : "text/plain", 
                content
            );
            mail.addContent(emailContent);

            Personalization personalization = new Personalization();
            for (String toAddress : toAddresses) {
                personalization.addTo(new Email(toAddress));
            }
            mail.addPersonalization(personalization);

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("Bulk email sent successfully to {} recipients", toAddresses.length);
                return true;
            } else {
                log.error("Failed to send bulk email. Status code: {}, Body: {}", 
                    response.getStatusCode(), response.getBody());
                return false;
            }
        } catch (IOException e) {
            log.error("Error sending bulk email", e);
            return false;
        }
    }

    @Override
    public boolean sendBulkEmailWithAttachments(String[] toAddresses, String subject, String content, boolean isHtml, Map<String, String> attachments) {
        try {
            Mail mail = new Mail();
            Email from = new Email(fromEmail, fromName);
            mail.setFrom(from);
            mail.setSubject(subject);

            Content emailContent = new Content(
                isHtml ? "text/html" : "text/plain", 
                content
            );
            mail.addContent(emailContent);

            Personalization personalization = new Personalization();
            for (String toAddress : toAddresses) {
                personalization.addTo(new Email(toAddress));
            }
            mail.addPersonalization(personalization);

            // Add attachments
            addAttachmentsToMail(mail, attachments);

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("Bulk email with attachments sent successfully to {} recipients", toAddresses.length);
                return true;
            } else {
                log.error("Failed to send bulk email with attachments. Status code: {}, Body: {}", 
                    response.getStatusCode(), response.getBody());
                return false;
            }
        } catch (IOException e) {
            log.error("Error sending bulk email with attachments", e);
            return false;
        }
    }

    @Override
    public boolean sendTemplateEmail(String to, String subject, String templateId, Map<String, String> templateData) {
        try {
            Mail mail = new Mail();
            Email from = new Email(fromEmail, fromName);
            Email toEmail = new Email(to);

            mail.setFrom(from);
            mail.setSubject(subject);

            Personalization personalization = new Personalization();
            personalization.addTo(toEmail);

            // Add template data as dynamic template data
            for (Map.Entry<String, String> entry : templateData.entrySet()) {
                personalization.addDynamicTemplateData(entry.getKey(), entry.getValue());
            }

            mail.addPersonalization(personalization);
            mail.setTemplateId(templateId);

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("Template email sent successfully to {}", to);
                return true;
            } else {
                log.error("Failed to send template email. Status code: {}, Body: {}", 
                    response.getStatusCode(), response.getBody());
                return false;
            }
        } catch (IOException e) {
            log.error("Error sending template email", e);
            return false;
        }
    }

    @Override
    public boolean sendTemplateEmailWithAttachments(String to, String subject, String templateId, Map<String, String> templateData, Map<String, String> attachments) {
        try {
            Mail mail = new Mail();
            Email from = new Email(fromEmail, fromName);
            Email toEmail = new Email(to);

            mail.setFrom(from);
            mail.setSubject(subject);

            Personalization personalization = new Personalization();
            personalization.addTo(toEmail);

            // Add template data as dynamic template data
            for (Map.Entry<String, String> entry : templateData.entrySet()) {
                personalization.addDynamicTemplateData(entry.getKey(), entry.getValue());
            }

            mail.addPersonalization(personalization);
            mail.setTemplateId(templateId);

            // Add attachments
            addAttachmentsToMail(mail, attachments);

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("Template email with attachments sent successfully to {}", to);
                return true;
            } else {
                log.error("Failed to send template email with attachments. Status code: {}, Body: {}", 
                    response.getStatusCode(), response.getBody());
                return false;
            }
        } catch (IOException e) {
            log.error("Error sending template email with attachments", e);
            return false;
        }
    }

    /**
     * Internal method to send an email with the specified content type.
     *
     * @param to      recipient email address
     * @param subject email subject
     * @param content email content with specified type
     * @return true if the email was sent successfully, false otherwise
     */
    private boolean sendEmailInternal(String to, String subject, Content content) {
        try {
            Email from = new Email(fromEmail, fromName);
            Email toEmail = new Email(to);
            Mail mail = new Mail(from, subject, toEmail, content);

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("Email sent successfully to {}", to);
                return true;
            } else {
                log.error("Failed to send email. Status code: {}, Body: {}", 
                    response.getStatusCode(), response.getBody());
                return false;
            }
        } catch (IOException e) {
            log.error("Error sending email", e);
            return false;
        }
    }

    /**
     * Internal method to send an email with the specified content type and attachments.
     *
     * @param to          recipient email address
     * @param subject     email subject
     * @param content     email content with specified type
     * @param attachments map of filename to base64 encoded content
     * @return true if the email was sent successfully, false otherwise
     */
    private boolean sendEmailInternalWithAttachments(String to, String subject, Content content, Map<String, String> attachments) {
        try {
            Email from = new Email(fromEmail, fromName);
            Email toEmail = new Email(to);
            Mail mail = new Mail(from, subject, toEmail, content);

            // Add attachments
            addAttachmentsToMail(mail, attachments);

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("Email with attachments sent successfully to {}", to);
                return true;
            } else {
                log.error("Failed to send email with attachments. Status code: {}, Body: {}", 
                    response.getStatusCode(), response.getBody());
                return false;
            }
        } catch (IOException e) {
            log.error("Error sending email with attachments", e);
            return false;
        }
    }

    /**
     * Helper method to add attachments to a Mail object.
     *
     * @param mail        the Mail object to add attachments to
     * @param attachments map of filename to base64 encoded content
     */
    private void addAttachmentsToMail(Mail mail, Map<String, String> attachments) {
        if (attachments != null && !attachments.isEmpty()) {
            for (Map.Entry<String, String> entry : attachments.entrySet()) {
                String filename = entry.getKey();
                String base64Content = entry.getValue();

                Attachments attachment = new Attachments();
                attachment.setContent(base64Content);
                attachment.setFilename(filename);
                attachment.setDisposition("attachment");

                // Try to determine content type from filename extension
                String contentType = "application/octet-stream"; // default
                if (filename.toLowerCase().endsWith(".pdf")) {
                    contentType = "application/pdf";
                } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (filename.toLowerCase().endsWith(".txt")) {
                    contentType = "text/plain";
                } else if (filename.toLowerCase().endsWith(".html") || filename.toLowerCase().endsWith(".htm")) {
                    contentType = "text/html";
                } else if (filename.toLowerCase().endsWith(".doc") || filename.toLowerCase().endsWith(".docx")) {
                    contentType = "application/msword";
                } else if (filename.toLowerCase().endsWith(".xls") || filename.toLowerCase().endsWith(".xlsx")) {
                    contentType = "application/vnd.ms-excel";
                } else if (filename.toLowerCase().endsWith(".ppt") || filename.toLowerCase().endsWith(".pptx")) {
                    contentType = "application/vnd.ms-powerpoint";
                } else if (filename.toLowerCase().endsWith(".zip")) {
                    contentType = "application/zip";
                }

                attachment.setType(contentType);
                mail.addAttachments(attachment);
            }
        }
    }
}
