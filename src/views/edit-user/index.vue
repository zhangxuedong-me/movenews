<template>
    <div class='edit-user-container'>
      <van-nav-bar
        title="编辑用户资料"
        left-text="取消"
        left-arrow
        @click-left="$router.back()"
      />
      <van-cell-group>
        <van-cell
          @click="file.click()"
          center title="头像"
          clickable
          is-link
          value="内容"
        >
          <van-image
            width="30"
            height="30"
            round
            :src="userData.photo"
          />
        </van-cell>
        <input @change="onChangeFile" ref="file" type="file" hidden />
        <van-cell
          center
          clickable
          is-link
          title="昵称"
          :value="userData.name"
          @click="isNamShow = true"
        />
        <van-cell
          center
          clickable
          is-link
          title="介绍"
          value="个人制作牛逼的头条"
        />
        <van-cell
          center
          clickable
          is-link
          title="性别"
          :value="userData.gender ? '女' : '男'"
          @click="isSexShow = true"
        />
        <van-cell
          center
          clickable
          is-link
          title="生日"
          :value="userData.birthday"
          @click="isBirthdayShow = true"
        />
      </van-cell-group>
      <!-- 修改昵称部分 -->
      <van-popup
        v-model="isNamShow"
        position="bottom"
        :style="{ height: '30%' }"
        :duration="0.3"
      >
        <edit-name
          @edit-name="editName"
          :name="userData.name"
          @close="isNamShow = false"
        />
      </van-popup>
      <!-- 修改性别部分 -->
      <van-popup
        v-model="isSexShow"
        position="bottom"
        :style="{ height: '30%' }"
        :duration="0.3"
      >
        <edit-sex
          @edit-name="editSex"
          @close="isSexShow = false"
          :userSex="userData.gender"
        />
      </van-popup>
      <!-- 修改生日 -->
      <van-popup
        v-model="isBirthdayShow"
        position="bottom"
        :style="{ height: '30%' }"
        :duration="0.3"
      >
        <edit-birthday
          @define="define"
          @close="isBirthdayShow = false"
        />
      </van-popup>
      <!-- 修改头像 -->
      <van-image-preview
        v-model="isPhotoShow"
        :images="images"
        @close="file.value = ''"
      >
        <van-nav-bar
          left-text="取消"
          right-text="确定"
          @click-left="isPhotoShow = false"
          @click-right="unloadImg"
          slot="cover"
        />
      </van-image-preview>
    </div>
</template>

<script>
import editName from './componets/edit-name'
import editSex from './componets/edit-sex'
import { getUserData, editUserData, editUploadImg } from '@/api/axios/user.js'
import editBirthday from './componets/edit-birthday'
import moment from 'moment'
export default {
  name: 'user-name',
  props: {

  },
  data () {
    return {
      isNamShow: false,
      isSexShow: false,
      userData: {},
      isBirthdayShow: false,
      isPhotoShow: false,
      images: [
      ]
    }
  },
  methods: {
    // 发送请求获取用户信息
    async getUserData () {
      try {
        const { data } = await getUserData()
        this.userData = data.data
      } catch (err) {
        this.$toast.fail('获取用户资料失败')
      }
    },
    // 封装一个请求编辑的用户菜单的请求
    async packageEdit (field, name) {
      this.$toast.loading({
        duration: 0, // 如果值为0的话会一直处于加载状态
        message: '保存中...',
        forbidClick: true
      })
      try {
        await editUserData({
          [field]: name
        })
        this.$toast.success('保存成功')
      } catch (err) {
        this.$toast.fail('保存失败')
      }
    },
    // 修改昵称
    async editName (name) {
      await this.packageEdit('name', name)
      this.userData.name = name
      this.isNamShow = false
    },
    // 修改性别
    async editSex (num) {
      await this.packageEdit('gender', num)
      this.userData.gender = num
      this.isSexShow = false
    },
    // 修改生日
    async define (value) {
      value = moment(value).format('YYYY-MM-DD')
      await this.packageEdit('birthday', value)
      this.userData.gender = value
      this.isBirthdayShow = false
      this.userData.birthday = value
    },
    // 当图片改变的时候触发
    onChangeFile () {
      this.isPhotoShow = true
      this.images = []
      // 给选择的图片创建一个临时的地址
      const imgUrl = URL.createObjectURL(this.file.files[0])
      this.images = [imgUrl]
    },
    // 点击确定的时候上传图片
    async unloadImg () {
      this.$toast.loading({
        duration: 0, // 如果值为0的话会一直处于加载状态
        message: '上传中...',
        forbidClick: true
      })
      let fd = new FormData()
      fd.set('photo', this.file.files[0])
      try {
        const { data } = await editUploadImg(fd)
        this.$toast.success('上传成功')
        this.userData.photo = data.data.photo
      } catch (err) {
        this.$toast.success('上传失败')
      } finally {
        this.isPhotoShow = false
      }
    }
  },
  created () {
    this.getUserData()
  },
  mounted () {

  },
  components: {
    editName,
    editSex,
    editBirthday
  },
  computed: {
    file () {
      return this.$refs['file']
    }
  },
  watch: {

  },
  filters: {

  }
}
</script>

<style lang='less' scoped>
  @import url('../../styles/variables.less');
  .edit-user-container {
    .van-nav-bar {
      background: @back-color;
      .van-icon {
        color: #fff;
      }
      .van-nav-bar__text {
        color: #fff;
      }
      .van-nav-bar__title {
        color: #fff;
      }
    }
    ::v-deep .van-image-preview__cover {
      top: unset;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>
