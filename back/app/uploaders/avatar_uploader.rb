# frozen_string_literal: true

class AvatarUploader < CarrierWave::Uploader::Base
  storage :file

  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # 受け付け可能なファイルの拡張子を指定
  def extension_allowlist
    %w[jpg jpeg png webp]
  end

  # デフォルトのURLを指定
  def default_url(*args)
    random_number = rand(1..25)
    "/uploads/user/sample_avatar/#{random_number}.webp"
  end
end

