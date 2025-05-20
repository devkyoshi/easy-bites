//package com.ds.commons.utils;
//
//import jakarta.mail.MessagingException;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.stereotype.Component;
//import jakarta.mail.internet.MimeMessage;
//
//@Component
//@RequiredArgsConstructor
//@Slf4j
//@ConditionalOnProperty(name = "spring.mail.username")
//public class EmailUtil {
//
//    private final JavaMailSender mailSender;
//
//    public void sendEmail(String to, String subject, String body) {
//        try {
//            MimeMessage message = mailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, true);
//            helper.setTo(to);
//            helper.setSubject(subject);
//            helper.setText(body, true);
//            mailSender.send(message);
//            log.info("Email sent to {}", to);
//        } catch (MessagingException e) {
//            log.error("Failed to send email to {}", to, e);
//        }
//    }
//}

