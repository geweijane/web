/*
 Navicat MySQL Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50716
 Source Host           : localhost:3306
 Source Schema         : ota_upgrade

 Target Server Type    : MySQL
 Target Server Version : 50716
 File Encoding         : 65001

 Date: 08/08/2018 09:41:54
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for chip
-- ----------------------------
DROP TABLE IF EXISTS `chip`;
CREATE TABLE `chip`  (
  `chip` varchar(24) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '芯片标识',
  `type` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '地址类型，mac 或者imei',
  PRIMARY KEY (`chip`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ota
-- ----------------------------
DROP TABLE IF EXISTS `ota`;
CREATE TABLE `ota`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '版本id',
  `version` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '版本号',
  `type` int(11) UNSIGNED NOT NULL COMMENT '固件类型',
  `file` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '文件地址',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint(1) NOT NULL COMMENT '状态 ,未验证 0，验证中 1，已验证 2，发布中 3，停止发布 4，已删除 -1',
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT 'mac地址或者imei地址',
  `create_time` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for otatype
-- ----------------------------
DROP TABLE IF EXISTS `otatype`;
CREATE TABLE `otatype`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '类型id，作用于ota表中的type',
  `chip` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '芯片类型，现有6060 6166',
  `project` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '项目标识，需和芯片传递过来一致',
  `customer` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '客户标识，需和芯片传递过来一致',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
